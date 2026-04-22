import { Link, useNavigate } from "react-router";
import { useState } from "react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", formData);
    // Handle registration logic here
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex min-h-screen font-poppins bg-white">
      {/* Left Side - Gradient Branding with Illustration */}
      <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 flex flex-col justify-center items-center py-16 px-12 relative overflow-hidden">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="group absolute top-8 left-8 flex items-center gap-1.5 bg-none border-none cursor-pointer p-2.5"
        >
          {/* Back Arrow SVG */}
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-poppins text-sm font-medium text-black">
            Back to Home
          </span>
        </button>

        {/* Logo BookVerse */}
        <div className="mb-10 text-center">
          <h1 className="font-poppins text-4xl font-bold text-white m-0 tracking-tight">
            BookVerse
          </h1>
          <p className="font-poppins text-sm font-normal text-white/90 mt-2 m-0">
            Exploring the World of Knowledge
          </p>
        </div>

        {/* Illustration */}
        <div className="w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1762803842029-5e34663d98be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlYWRpbmclMjBib29rJTIwbW9kZXJuJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NTc4NjY0NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Person reading book"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tagline */}
        <p className="font-poppins text-base font-medium text-white text-center mt-8 leading-relaxed max-w-[300px]">
          Join thousands of readers and discover unforgettable reading
          adventures
        </p>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 py-20 px-12 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-8">
          <h2 className="font-poppins text-2xl font-bold text-slate-800 m-0 mb-2">
            Create BookVerse Account
          </h2>
          <p className="font-poppins text-sm font-normal text-slate-500 m-0">
            Start your reading journey with us
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block font-poppins text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@email.com"
              required
              className="w-full h-12 px-4 font-poppins text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            />
          </div>

          {/* Full Name Input */}
          <div className="mb-4">
            <label className="block font-poppins text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full h-12 px-4 font-poppins text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block font-poppins text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="w-full h-12 px-4 font-poppins text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-5">
            <label className="block font-poppins text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              className="w-full h-12 px-4 font-poppins text-sm text-slate-800 bg-white border border-slate-200 rounded-xl outline-none transition-all duration-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
            />
          </div>

          {/* Checkbox Agreement */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
                className="w-[18px] h-[18px] mt-0.5 cursor-pointer accent-blue-600 flex-shrink-0"
              />
              <span className="font-poppins text-[13px] font-normal text-slate-500 leading-relaxed">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-blue-600 no-underline font-medium hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 no-underline font-medium hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                of BookVerse.
              </span>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full h-12 font-poppins text-[15px] font-semibold text-white bg-blue-600 border-none rounded-xl cursor-pointer transition-all duration-300 mb-6 hover:bg-blue-700 hover:-translate-y-px hover:shadow-md"
          >
            Register Now
          </button>
        </form>

        {/* Footer - Login */}
        <div className="text-center">
          <p className="font-poppins text-sm font-normal text-slate-500 m-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-poppins text-sm font-semibold text-blue-600 no-underline hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
