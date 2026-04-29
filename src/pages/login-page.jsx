import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 font-poppins">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Login to BookVerse
          </h1>
          <p className="text-sm text-slate-500">
            Welcome back!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3 mt-1 bg-slate-50 border rounded-lg"
              required
            />
          </div>

          <div className="mb-2">
            <label className="text-sm text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3 mt-1 bg-slate-50 border rounded-lg"
              required
            />
          </div>

          <div className="text-right mb-5">
            <Link to="/forgot-password" className="text-xs text-blue-600">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full h-11 bg-blue-600 text-white rounded-full"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center pt-5 mt-6 border-t">
          <p className="text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold">
              Sign Up Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}