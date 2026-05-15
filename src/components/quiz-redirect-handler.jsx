import { Navigate } from "react-router";
import { useAuth } from "@/context/auth-context";
import { useQuiz } from "@/context/quiz-context";

export default function QuizRedirectHandler({ children }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasCompletedQuiz, isLoading: quizLoading } = useQuiz();

  console.log("QuizRedirectHandler - Status:", { 
    isAuthenticated, 
    authLoading, 
    hasCompletedQuiz, 
    quizLoading 
  });

  if (authLoading || quizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (hasCompletedQuiz === false) {
    console.log("Redirecting to personality quiz...");
    return <Navigate to="/personality-quiz" replace />;
  }

  return children;
}