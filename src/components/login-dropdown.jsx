import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "@/context/auth-context";

export default function LoginDropdown({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { login, loginLoading } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result  = await login(email, password);
    if (result) {
      onClose?.();
    }    
  };

  if (!shouldRender) return null;

  return (
    <>
      {/* Overlay with fade animation */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        onClick={onClose}
      />

      {/* Dropdown Card with scale and fade animation */}
      <div
        className={`absolute top-full right-0 z-50 transition-all duration-300 origin-top-right ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2"
        }`}
        style={{
          width: "320px",
          marginTop: "16px",
        }}
      >
        <div className="bg-white rounded-2xl shadow-lg font-poppins relative">
          {/* Arrow/Triangle pointing up */}
          <div className="absolute -top-2 right-6 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white" />

          {/* Content */}
          <div className="p-6">
            {/* Header */}
            <div className="relative mb-6">
              <button
                onClick={onClose}
                className="absolute -top-1 -right-1 p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                title="Close"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>

              <h3 className="font-poppins text-lg font-bold text-slate-800 mb-1 leading-relaxed">
                Login to BookVerse
              </h3>
              <p className="font-poppins text-xs text-slate-500 leading-relaxed">
                Welcome back!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-4">
                <label className="block font-poppins text-xs font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full h-10 px-3 font-poppins text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white hover:border-slate-300"
                />
              </div>

              {/* Password Input */}
              <div className="mb-2">
                <label className="block font-poppins text-xs font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-10 px-3 font-poppins text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all duration-300 focus:border-blue-600 focus:bg-white hover:border-slate-300"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right mb-5">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="font-poppins text-xs font-medium text-blue-600 no-underline hover:underline transition-all duration-200"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 font-poppins text-sm font-semibold text-white bg-blue-600 border-none rounded-full cursor-pointer transition-all duration-300 shadow-md hover:bg-blue-700 hover:-translate-y-px hover:shadow-lg active:translate-y-0 active:shadow-md mb-4"
                disabled={loginLoading}
              >
                Login
              </button>
            </form>

            {/* Footer - Register Link */}
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="font-poppins text-xs text-slate-500 leading-relaxed">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  onClick={onClose}
                  className="font-semibold text-blue-600 no-underline hover:underline transition-all duration-200"
                >
                  Sign Up Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
