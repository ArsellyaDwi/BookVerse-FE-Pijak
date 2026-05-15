import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(null);
  const [personalityScores, setPersonalityScores] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkQuizStatus = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    console.log("checkQuizStatus - token exists:", !!token);
    
    if (!token) {
      setHasCompletedQuiz(false);
      setPersonalityScores(null);
      setIsLoading(false);
      return;
    }

    const cachedStatus = localStorage.getItem("quiz_completed");
    const cachedScores = localStorage.getItem("personality_scores");
    
    console.log("Cached status:", cachedStatus);
    
    if (cachedStatus === "true" && cachedScores) {
      setHasCompletedQuiz(true);
      setPersonalityScores(JSON.parse(cachedScores));
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching personality status from backend...");
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
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await axios.post("/auth/personality", scores, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setHasCompletedQuiz(true);
        setPersonalityScores(scores);
        localStorage.setItem("quiz_completed", "true");
        localStorage.setItem("personality_scores", JSON.stringify(scores));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to save personality:", error);
      return false;
    }
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