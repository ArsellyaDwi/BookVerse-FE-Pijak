import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import useMutation from "@/hooks/use-mutation";
import useQuery from "@/hooks/use-query";
import axios from "axios";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { mutate: loginMutation, loading: loginLoading } = useMutation({
    url: "/auth/login",
    method: "POST",
    guard: false,
    onSuccess: (data) => {
      console.log({ data });
      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      toast.success("Login successful!");
      navigate("/");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    },
  });

  const { mutate: registerMutation, loading: registerLoading } = useMutation({
    url: "/auth/register",
    method: "POST",
    guard: false,
    onSuccess: (data) => {
      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);

      toast.success("Registration successful!");
      navigate("/dashboard");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });

  const { mutate: logoutMutation, loading: logoutLoading } = useMutation({
    url: "/auth/logout",
    method: "POST",
    guard: true,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      delete axios.defaults.headers.common["Authorization"];

      setUser(null);

      toast.info("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      navigate("/login");
    },
  });

  const { execute: fetchUser, loading: fetchLoading } = useQuery({
    url: "/auth/me",
    method: "GET",
    guard: true,
    immediate: false,
    onSuccess: (data) => {
      const userData = data.user;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
    },
    onError: (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to initialize auth:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (email, password) => {
      const result = await loginMutation(
        { email, password },
      );
      return result;
    },
    [loginMutation]
  );

  const register = useCallback(
    async (userData) => {
      return await registerMutation(userData);
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation({});
  }, [logoutMutation]);

  const updateUser = useCallback(
    (updatedData) => {
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
    [user]
  );

  const value = {
    user,
    loading: loading || fetchLoading,

    login,
    register,
    logout,
    updateUser,

    loginLoading,
    registerLoading,
    logoutLoading,

    fetchUser,

    isAuthenticated: !!user && !!localStorage.getItem("token"),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
