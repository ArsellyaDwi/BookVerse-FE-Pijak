import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingCount((prev) => {
      const newCount = prev - 1;
      if (newCount <= 0) {
        setIsLoading(false);
        return 0;
      }
      return newCount;
    });
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
