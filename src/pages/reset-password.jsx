import { Link, useNavigate, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");
  
  const [email, setEmail] = useState(emailFromUrl || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("Token from URL:", token);
    console.log("Email from URL:", emailFromUrl);
    
    if (!token || !emailFromUrl) {
      toast.error("Invalid reset link. Missing required parameters.");
      setTimeout(() => navigate("/forgot-password"), 2000);
    }
  }, [token, emailFromUrl, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validasi client-side
    let hasError = false;
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    
    if (!token) {
      newErrors.token = "Token is missing";
      hasError = true;
    }
    
    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
      hasError = true;
    }
    
    if (hasError) {
      setErrors(newErrors);
      toast.error(Object.values(newErrors)[0]);
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          token: token,
          password: password,
          password_confirmation: confirmPassword,
        }),
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (response.ok && data.success === true) {
        toast.success("Password reset successful! Please login with your new password.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        if (data.errors) {
          setErrors(data.errors);
          toast.error(Object.values(data.errors)[0]?.[0] || data.message || "Failed to reset password");
        } else {
          toast.error(data.message || "Failed to reset password");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Jika token atau email tidak ada
  if (!token || !emailFromUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">
            The reset link is invalid or missing required parameters.
          </p>
          <Link 
            to="/forgot-password" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-poppins bg-white">
      {/* LEFT SIDE - Branding */}
      <div className="hidden lg:flex lg:flex-1 relative flex-col justify-center items-center p-16 border-r border-slate-100 bg-white">
        <button 
          onClick={() => navigate("/")} 
          className="group absolute top-10 left-10 flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-bold text-xs uppercase tracking-widest">Back to Home</span>
        </button>

        <div className="w-full max-w-md mb-12">
          <h2 className="text-3xl font-bold text-slate-800 leading-tight mb-4">
            Create New Password
          </h2>
          <p className="text-slate-500 leading-relaxed text-lg">
            Enter your new password below.
          </p>
        </div>

        <div className="relative w-full max-w-sm aspect-square">
          <div className="absolute inset-0 bg-blue-50 rounded-full scale-90 opacity-40 blur-3xl animate-pulse"></div>
          <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-blue-100 border-[10px] border-white transition-transform hover:rotate-2 duration-500">
            <img
              src="https://images.unsplash.com/photo-1616606103915-dea7be788566?q=80&w=1080"
              alt="Reset password illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="absolute bottom-10 left-16">
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            © 2026 PT. BookVerse Global Media
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-8 md:px-20 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Set New Password
            </h2>
            <p className="text-slate-500">
              Reset password for: <strong className="text-blue-600">{emailFromUrl}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                readOnly={!!emailFromUrl}
                className={`w-full h-14 px-5 mt-1 bg-slate-50 border rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 ${
                  errors.email ? 'border-red-500' : 'border-slate-100'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* New Password Field */}
            <div>
              <label className="text-sm font-bold text-slate-700 ml-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className={`w-full h-14 px-5 mt-1 bg-slate-50 border rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 pr-12 ${
                    errors.password ? 'border-red-500' : 'border-slate-100'
                  }`}
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
              <p className="text-xs text-slate-400 ml-1 mt-1">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="text-sm font-bold text-slate-700 ml-1">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className={`w-full h-14 px-5 mt-1 bg-slate-50 border rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-100'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Show Password Checkbox */}
            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
              <label htmlFor="showPassword" className="text-sm text-slate-600 cursor-pointer">
                Show password
              </label>
            </div>

            {/* Error Token Message */}
            {errors.token && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{errors.token}</p>
                <Link 
                  to="/forgot-password" 
                  className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                >
                  Request new reset link →
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 font-bold text-white bg-blue-600 rounded-2xl cursor-pointer shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting...</span>
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-slate-400 text-xs font-bold uppercase tracking-widest">
              Remember your password?
            </span>
          </div>

          <p className="text-center text-slate-500 text-sm">
            Back to{" "}
            <Link to="/login" className="text-blue-600 font-bold no-underline hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}