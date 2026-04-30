import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const result = await login(formData.email, formData.password);
    if (result) {
      toast.success("Login successful!");
      navigate("/");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-poppins bg-white">
      {/* LEFT SIDE: Visual Branding */}
      <div className="hidden lg:flex lg:flex-1 relative flex-col justify-center items-center p-16 border-r border-slate-100 bg-white">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="group absolute top-10 left-10 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors border-none bg-transparent cursor-pointer"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-bold text-xs uppercase tracking-widest">Back to Home</span>
        </button>

        {/* Branding Info */}
        <div className="w-full max-w-md mb-12">
          <h2 className="text-3xl font-bold text-slate-800 leading-tight mb-4">
            Welcome Back to BookVerse
          </h2>
          <p className="text-slate-500 leading-relaxed m-0 text-lg">
            Continue your reading journey and explore thousands of amazing books.
          </p>
        </div>

        {/* Illustration Card */}
        <div className="relative w-full max-w-sm aspect-square">
          <div className="absolute inset-0 bg-blue-50 rounded-full scale-90 opacity-40 blur-3xl animate-pulse"></div>
          <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-blue-100 border-[10px] border-white transition-transform hover:rotate-2 duration-500">
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1080"
              alt="Person reading a book"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="absolute bottom-10 left-16">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest m-0">
            © 2026 PT. BookVerse Global Media
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-8 md:px-20 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500">
              Login to access your BookVerse account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@email.com"
                required
                className="w-full h-14 px-5 text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full h-14 px-5 text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 rounded border-slate-200 cursor-pointer"
                />
                <span className="text-xs text-slate-500">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full h-14 font-bold text-white bg-blue-600 rounded-2xl cursor-pointer shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loginLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login Now"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-slate-400 text-xs font-bold uppercase tracking-widest">
              New to BookVerse?
            </span>
          </div>

          {/* Register Link */}
          <p className="text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold no-underline hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}