import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/context/auth-context";
import useQuery from "@/hooks/use-query";

export default function QuizRedirectHandler({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const isQuizPage = location.pathname === "/personality-quiz";

  const { data: personalityStatus, loading: quizLoading } = useQuery({
    url: "auth/personality-status",
    guard: true,
    immediate: isAuthenticated,
  });

  const hasCompletedQuiz = personalityStatus?.has_completed;

  console.log("QuizRedirectHandler - Status:", {
    isAuthenticated,
    authLoading,
    hasCompletedQuiz,
    quizLoading,
    isQuizPage,
    pathname: location.pathname,
    personalityStatus
  });

  if (authLoading || quizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  // @note: jika tidak login tidak masalah
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  if (hasCompletedQuiz === true && isQuizPage) {
    console.log("Quiz already completed, redirecting to home...");
    return <Navigate to="/" replace />;
  }

  if (hasCompletedQuiz === false && !isQuizPage) {
    console.log("Redirecting to personality quiz...");
    return <Navigate to="/personality-quiz" replace />;
  }

  return children;
}