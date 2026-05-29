import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/context/auth-context";
import useQuery from "@/hooks/use-query";

export default function QuizRedirectHandler({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const isQuizPage = location.pathname === "/personality-quiz";

  const { data: personalityStatus, loading: quizLoading } = useQuery({
    url: "auth/personality-status",
    guard: false,
    // immediate: isAuthenticated,
    mustLogin: true,
  });

  const hasCompletedQuiz = personalityStatus?.has_completed;

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