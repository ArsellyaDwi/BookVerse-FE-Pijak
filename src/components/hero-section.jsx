import { useState, useEffect, useCallback, useMemo } from "react";
import { Sparkles, Waves, Wind, Zap, Heart, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";

const emotionIcons = {
  happiness: <Sparkles size={16} />,
  joy: <Sparkles size={16} />,
  love: <Heart size={16} />,
  relief: <Heart size={16} />,
  sadness: <Waves size={16} />,
  anxiety: <Wind size={16} />,
  fear: <Wind size={16} />,
  anger: <Zap size={16} />,
  excitement: <Sparkles size={16} />,
  hope: <Sparkles size={16} />,
  gratitude: <Heart size={16} />,
  loneliness: <Heart size={16} />,
  surprise: <Sparkles size={16} />,
  pride: <Sparkles size={16} />,
  guilt: <Waves size={16} />,
  disappointment: <Waves size={16} />,
  frustration: <Zap size={16} />,
  embarrassment: <Waves size={16} />,
  disgust: <Wind size={16} />,
  confusion: <Wind size={16} />,
  default: <Sparkles size={16} />
};

const emotionColors = {
  happiness: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
  joy: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
  love: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200",
  relief: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200",
  sadness: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  anxiety: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200",
  fear: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  anger: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
  default: "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
};

const fallbackEmotions = ["happiness", "sadness", "anxiety", "fear", "love", "relief", "anger", "excitement", "hope", "gratitude"];

export default function HeroSection() {
  const navigate = useNavigate();
  const [moodInput, setMoodInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeMood, setActiveMood] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableEmotions, setAvailableEmotions] = useState([]);
  const [isLoadingEmotions, setIsLoadingEmotions] = useState(true);
  const [error, setError] = useState(null);
  const [languageWarning, setLanguageWarning] = useState("");

  const isEnglishText = useCallback((text) => {
    return !/[^\x00-\x7F]/.test(text);
  }, []);

  const handleMoodChange = useCallback((e) => {
    const newValue = e.target.value;
    setMoodInput(newValue);
    setActiveMood("");
    setError(null);
    
    if (newValue.length > 0 && !isEnglishText(newValue)) {
      setLanguageWarning("Please use English only. Our AI works best with English text.");
    } else {
      setLanguageWarning("");
    }
  }, [isEnglishText]);

  const handleMoodClick = useCallback((emotion) => {
    setActiveMood(emotion);
    setMoodInput(`Feeling ${emotion} today. Looking for a story that gets me.`);
    setError(null);
    setLanguageWarning("");
  }, []);

  const handleGenerate = useCallback(async () => {
    const trimmedInput = moodInput.trim();
    
    if (trimmedInput.length < 5) {
      setError("Please describe your mood first (min. 5 characters)");
      return;
    }

    if (!isEnglishText(moodInput)) {
      setError("Please use English only. Write your mood in English for the best recommendations.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/emotion/detect", { text: moodInput });
      
      if (response.data.success) {
        const predictions = response.data.data?.predictions || [];
        const topEmotion = predictions[0]?.emotion || "neutral";
        const confidence = predictions[0]?.confidence || 0;

        navigate(`/recommendations?emotion=${topEmotion}&confidence=${Math.round(confidence * 100)}&mood=${encodeURIComponent(moodInput)}`);
      } else {
        setError(response.data.message || "Failed to detect emotion");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [moodInput, isEnglishText, navigate]);

  const getEmotionIcon = useCallback((emotion) => {
    return emotionIcons[emotion.toLowerCase()] || emotionIcons.default;
  }, []);

  const getEmotionColor = useCallback((emotion) => {
    return emotionColors[emotion.toLowerCase()] || emotionColors.default;
  }, []);

  const displayedEmotions = useMemo(() => {
    return availableEmotions.slice(0, 12);
  }, [availableEmotions]);

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const response = await axios.get("/emotion/list");
        if (response.data.success && Array.isArray(response.data.data)) {
          setAvailableEmotions(response.data.data);
        } else {
          setAvailableEmotions(fallbackEmotions);
        }
      } catch (err) {
        setAvailableEmotions(fallbackEmotions);
      } finally {
        setIsLoadingEmotions(false);
      }
    };
    
    fetchEmotions();
  }, []);

  return (
    <section className="relative bg-white overflow-hidden font-poppins">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-64 h-64 sm:w-80 sm:h-80 bg-blue-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-64 h-64 sm:w-80 sm:h-80 bg-purple-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-blue-50 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-12 sm:py-16 md:py-20 lg:py-28 text-center">
        
        <div className="mb-8 md:mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight">
            Find the story that matches your
            <span className="text-blue-600 block mt-2 md:mt-3">inner world</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-lg mx-auto mt-4 md:mt-6 px-4">
            Tell us how you feel, we'll find the perfect story to match your vibe
          </p>
        </div>

        {isLoadingEmotions ? (
          <div className="max-w-4xl mx-auto mb-8 md:mb-10">
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-20 h-8 sm:w-24 sm:h-9 bg-gray-200 rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10 lg:mb-12 max-w-4xl mx-auto">
            {displayedEmotions.map((emotion) => (
              <button
                key={emotion}
                onClick={() => handleMoodClick(emotion)}
                className={`
                  flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 capitalize
                  ${activeMood === emotion 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                    : getEmotionColor(emotion)
                  }
                `}
              >
                {getEmotionIcon(emotion)}
                <span>{emotion}</span>
              </button>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto mb-8 md:mb-10 px-4 sm:px-6">
          <div className={`relative transition-all duration-300 ${isFocused ? "scale-[1.01] md:scale-[1.02]" : ""}`}>
            <div className="absolute left-4 sm:left-5 md:left-6 top-5 -translate-y-1/2 z-10">
              <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isFocused ? "text-blue-500" : "text-slate-400"}`} />
            </div>
            
            <textarea
              rows={3}
              value={moodInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleMoodChange}
              placeholder="How are you feeling right now? Tell me in a few words... (English only)"
              className="w-full pl-12 sm:pl-14 md:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 bg-white border-2 border-slate-200 rounded-xl md:rounded-2xl text-slate-800 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:shadow-xl transition-all resize-none"
              style={{ minHeight: "100px", lineHeight: "1.5", textAlign: "left" }}
            />
          </div>
          
          <div className="flex items-start gap-2 mt-3 text-left">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-600">
              <span className="font-medium">English only:</span> Write in English for better story matches.
            </p>
          </div>

          {languageWarning && (
            <div className="flex items-start gap-2 mt-2 text-left bg-red-50 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{languageWarning}</p>
            </div>
          )}

          <p className="text-slate-400 text-xs mt-2 text-left ml-1">
            Examples: 
            <span className="text-slate-500"> "Feeling a bit down and need something uplifting"</span> or 
            <span className="text-slate-500"> "Super excited and want an adventure story"</span>
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-6">
          <span className={`text-xs md:text-sm font-mono ${moodInput.length > 0 ? "text-blue-500" : "text-slate-300"}`}>
            {moodInput.length} / 300
          </span>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || moodInput.trim().length < 5}
            className={`
              flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300
              ${moodInput.trim().length >= 5 && !isLoading
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline">Looking for your next read...</span>
                <span className="sm:hidden">Finding...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Find My Story</span>
                <span className="sm:hidden">Find</span>
                <ArrowRight size={16} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-red-500 text-xs sm:text-sm mt-4">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        <p className="text-slate-400 text-xs mt-6 md:mt-8">
          Stories tailored just for you
        </p>
      </div>
    </section>
  );
}