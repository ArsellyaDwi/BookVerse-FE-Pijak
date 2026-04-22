import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const useQuery = ({
  url,
  method = "GET",
  params = {},
  guard = false,
  immediate = true,
  onSuccess = null,
  onError = null,
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUnauthorized = useCallback(() => {
    if (guard) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [guard, navigate]);

  const execute = useCallback(
    async (customParams = {}) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = { ...params, ...customParams };

        if (guard) {
          const token = localStorage.getItem("token");
          if (!token) {
            handleUnauthorized();
            return null;
          }

          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        let response;

        switch (method.toUpperCase()) {
          case "GET":
            response = await axios.get(url, { params: queryParams });
            break;
          case "POST":
            response = await axios.post(url, queryParams);
            break;
          case "PUT":
            response = await axios.put(url, queryParams);
            break;
          case "DELETE":
            response = await axios.delete(url, { data: queryParams });
            break;
          case "PATCH":
            response = await axios.patch(url, queryParams);
            break;
          default:
            response = await axios.get(url, { params: queryParams });
        }

        setData(response.data);
        if (onSuccess) onSuccess(response.data);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "An error occurred";

        if (err.response?.status === 401) {
          handleUnauthorized();
          toast.error("Authentication failed. Please login again.");
        } else {
          toast.error(errorMessage);
        }

        setError(err);
        if (onError) onError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [url, method, params, guard, handleUnauthorized, onSuccess, onError]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch: execute,
  };
};

export default useQuery;
