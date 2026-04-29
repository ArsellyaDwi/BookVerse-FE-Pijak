import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

import LogoBookVerse from "@/assets/logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password tidak cocok!");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Anda harus menyetujui Syarat dan Ketentuan!");
      return;
    }
    await register(formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-poppins bg-white">

      {/* LEFT SIDE: Visual Branding (Style Clean & Modern) */}
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
            Exploring the World of Knowledge
          </h2>
          <p className="text-slate-500 leading-relaxed m-0 text-lg">
            Join thousands of readers and discover unforgettable reading adventures.
          </p>
        </div>

        {/* Illustration Card */}
        <div className="relative w-full max-w-sm aspect-square">
          <div className="absolute inset-0 bg-blue-50 rounded-full scale-90 opacity-40 blur-3xl animate-pulse"></div>
          <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden shadow-2xl shadow-blue-100 border-[10px] border-white transition-transform hover:rotate-2 duration-500">
            <img
              src="https://images.unsplash.com/photo-1762803842029-5e34663d98be?q=80&w=1080"
              alt="Person reading"
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

      {/* RIGHT SIDE: Registration Form (Super Clean) */}
      <div className="flex-1 flex flex-col justify-center py-12 px-8 md:px-20 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create BookVerse Account</h2>
            <p className="text-slate-500">Start your reading journey with us today.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
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
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full h-14 px-5 text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full h-14 px-5 text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                className="w-full h-14 px-5 text-slate-800 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="py-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 cursor-pointer accent-blue-600 rounded-md border-slate-200"
                />
                <span className="text-xs text-slate-500 leading-normal">
                  I agree to the <Link to="/terms" className="text-blue-600 font-bold hover:underline no-underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-blue-600 font-bold hover:underline no-underline">Privacy Policy</Link> of BookVerse.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-14 font-bold text-white bg-blue-600 rounded-2xl cursor-pointer shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 border-none"
            >
              Register Now
            </button>
          </form>

          {/* Footer Login */}
          <div className="relative my-10 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative px-4 bg-white text-slate-400 text-xs font-bold uppercase tracking-widest">Or</span>
          </div>

          <p className="text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold no-underline hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}