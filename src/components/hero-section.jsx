import { useState, useEffect } from "react";
import { Sparkles, Waves, Wind, Zap, Heart, ArrowRight } from "lucide-react";
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

export default function HeroSection() {
  const navigate = useNavigate();
  const [moodInput, setMoodInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeMood, setActiveMood] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableEmotions, setAvailableEmotions] = useState([]);
  const [isLoadingEmotions, setIsLoadingEmotions] = useState(true);
  const [error, setError] = useState(null);

  const characterLimit = 300;

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const response = await axios.get("/emotion/list");
        console.log("API Response:", response.data);
        
        if (response.data.success) {
          let emotions = response.data.data;

          if (Array.isArray(emotions)) {
            setAvailableEmotions(emotions);
          } else {
            setAvailableEmotions([
              "happiness", "sadness", "anxiety", "fear", "love", 
              "relief", "anger", "excitement", "hope", "gratitude"
            ]);
          }
        } else {
          setAvailableEmotions([
            "happiness", "sadness", "anxiety", "fear", "love", 
            "relief", "anger", "excitement", "hope", "gratitude"
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch emotions:", err);
        setAvailableEmotions([
          "happiness", "sadness", "anxiety", "fear", "love", 
          "relief", "anger", "excitement", "hope", "gratitude"
        ]);
      } finally {
        setIsLoadingEmotions(false);
      }
    };
    
    fetchEmotions();
  }, []);

  const handleMoodClick = (emotion) => {
    setActiveMood(emotion);
    setMoodInput(`I'm feeling ${emotion} today... I want a story that matches this mood.`);
    setError(null);
  };

  const handleGenerate = async () => {
    if (moodInput.trim().length < 5) {
      setError("Please describe your mood first (min. 5 characters)");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/emotion/detect", {
        text: moodInput
      });
      
      if (response.data.success) {
        const predictions = response.data.data?.predictions || [];
        const topEmotion = predictions.length > 0 ? predictions[0].emotion : "neutral";
        const confidence = predictions.length > 0 ? predictions[0].confidence : 0;

        navigate(`/recommendations?emotion=${topEmotion}&confidence=${Math.round(confidence * 100)}&mood=${encodeURIComponent(moodInput)}`);
      } else {
        setError(response.data.message || "Failed to detect emotion");
      }
    } catch (err) {
      console.error("Error calling AI:", err);
      setError(err.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getEmotionIcon = (emotion) => {
    return emotionIcons[emotion.toLowerCase()] || emotionIcons.default;
  };

  const getEmotionColor = (emotion) => {
    return emotionColors[emotion.toLowerCase()] || emotionColors.default;
  };

  if (isLoadingEmotions) {
    return (
      <section className="relative bg-white overflow-hidden font-poppins">
        <div className="relative max-w-[1200px] mx-auto px-6 py-24 md:py-32 text-center">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded w-3/4 mx-auto mb-10"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white overflow-hidden font-poppins">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-6 py-24 md:py-32 text-center">
        
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-6 tracking-tight leading-[1.2]">
            Find the story that matches your
            <span className="text-blue-600 block mt-3">inner world</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-lg mx-auto mt-6">
            Select your mood or describe how you feel and we'll recommend books just for you
          </p>
        </div>

        {/* Mood Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-4xl mx-auto">
          {availableEmotions.length > 0 && availableEmotions.map((emotion) => (
            <button
              key={emotion}
              onClick={() => handleMoodClick(emotion)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize
                ${activeMood === emotion 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                  : getEmotionColor(emotion)
                }
              `}
            >
              {getEmotionIcon(emotion)}
              {emotion}
            </button>
          ))}
        </div>

        {/* Mood Input Box */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className={`relative transition-all duration-300 ${isFocused ? "scale-[1.02]" : ""}`}>
            <Sparkles className={`absolute left-6 top-5 w-6 h-6 transition-colors ${isFocused ? "text-blue-500" : "text-slate-400"}`} />
            <textarea
              rows="1"
              value={moodInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                setMoodInput(e.target.value);
                setActiveMood("");
                setError(null);
              }}
              placeholder="Describe the atmosphere you're looking for..."
              className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-200 rounded-2xl text-slate-800 text-lg placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:shadow-xl transition-all resize-none overflow-hidden"
              style={{ minHeight: "68px" }}
            />
          </div>
        </div>

        {/* Character Counter & Generate Button */}
        <div className="flex items-center justify-center gap-6">
          <span className={`text-sm font-mono ${moodInput.length > 0 ? "text-blue-500" : "text-slate-300"}`}>
            {moodInput.length} / {characterLimit}
          </span>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || moodInput.trim().length < 5}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full text-base font-semibold transition-all duration-300
              ${moodInput.trim().length >= 5 && !isLoading
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Finding stories...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Recommendations</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}

        {/* Helper Text */}
        <p className="text-slate-400 text-xs mt-8">
          Powered by AI — recommendations based on your unique emotional profile
        </p>
        
      </div>
    </section>
  );
}