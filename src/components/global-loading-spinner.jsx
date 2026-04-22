import { useLoading } from "@/context/loading-context";
import { useState, useEffect } from "react";

export default function GlobalLoadingSpinner() {
  const { isLoading } = useLoading();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setShouldRender(false), 100);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-9999 flex items-center justify-center transition-all duration-100 ${
        isVisible
          ? "bg-black/10 backdrop-blur-xs"
          : "bg-black/0 backdrop-blur-none"
      }`}
    >
      <div
        className={`transform transition-all duration-200 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="bg-white rounded-4xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}
