import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email address");
      toast.error("Please enter your email address");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      console.log("Response:", data);
      
      if (response.ok && data.success) {
        setIsSubmitted(true);
        toast.success(data.message || "Reset link sent to your email!");
        
        // Untuk development, tampilkan token di console
        if (data.reset_token) {
          console.log("Reset Token:", data.reset_token);
          console.log("Reset URL:", data.reset_url);
        }
      } else {
        setError(data.message || "Failed to send reset link");
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-poppins bg-white">
      {/* LEFT SIDE */}
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
            Forgot Password?
          </h2>
          <p className="text-slate-500 leading-relaxed text-lg">
            Don't worry! We'll help you reset your password.
          </p>
        </div>

        <div className="relative w-full max-w-sm aspect-square">
          <div className="absolute inset-0 bg-blue-50 rounded-full scale-90 opacity-40 blur-3xl animate-pulse"></div>
          <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-blue-100 border-[10px] border-white transition-transform hover:rotate-2 duration-500">
            <img
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1080"
              alt="Forgot password"
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

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col justify-center py-12 px-8 md:px-20 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Forgot Password?
            </h2>
            <p className="text-slate-500">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {isSubmitted ? (
            // Success State
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Check Your Email</h3>
              <p className="text-slate-500 mb-6">
                We've sent a password reset link to <strong className="text-blue-600">{email}</strong>
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full h-14 font-bold text-white bg-blue-600 rounded-2xl cursor-pointer shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95"
              >
                Back to Login
              </button>
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full h-14 px-5 text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 font-bold text-white bg-blue-600 rounded-2xl cursor-pointer shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          {!isSubmitted && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}