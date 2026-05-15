import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(null);
  const [personalityScores, setPersonalityScores] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkQuizStatus = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setHasCompletedQuiz(false);
      setPersonalityScores(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("/auth/personality-status", {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Backend response:", response.data);

      if (response.data.success) {
        const completed = response.data.has_completed || false;
        setHasCompletedQuiz(completed);

        if (completed && response.data.personality) {
          setPersonalityScores(response.data.personality);
          localStorage.setItem("quiz_completed", "true");
          localStorage.setItem("personality_scores", JSON.stringify(response.data.personality));
        } else {
          localStorage.removeItem("quiz_completed");
          localStorage.removeItem("personality_scores");
        }
      } else {
        setHasCompletedQuiz(false);
      }
    } catch (error) {
      console.error("Failed to check quiz status:", error);
      setHasCompletedQuiz(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markQuizCompleted = useCallback(async (scores) => {
    checkQuizStatus();
  }, []);

  useEffect(() => {
    checkQuizStatus();
  }, [checkQuizStatus]);

  return (
    <QuizContext.Provider value={{
      hasCompletedQuiz,
      personalityScores,
      isLoading,
      checkQuizStatus,
      markQuizCompleted
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => useContext(QuizContext);