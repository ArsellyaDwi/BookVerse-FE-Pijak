import { Outlet } from "react-router";
import { useAuth } from "@/context/auth-context";

const AuthLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="font-poppins text-sm text-gray-500">Just a moment...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-poppins">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Friendly Lock Icon */}
          <div className="mx-auto mb-6">
            <svg
              className="w-20 h-20 text-blue-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h1 className="font-poppins text-3xl font-bold text-gray-800 mb-3">
            Oops! You're logged out
          </h1>

          <p className="font-poppins text-base text-gray-500 mb-8 leading-relaxed">
            Looks like you've been logged out. Please login again to continue
            your reading journey with us! 📚
          </p>

          {/* Horizontal Buttons */}
          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="px-8 py-3 font-poppins text-sm font-semibold text-white bg-blue-600 rounded-full transition-all duration-300 hover:bg-blue-700"
            >
              Login Now
            </a>

            <a
              href="/"
              className="px-8 py-3 font-poppins text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-full transition-all duration-300 hover:bg-blue-50"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AuthLayout;
