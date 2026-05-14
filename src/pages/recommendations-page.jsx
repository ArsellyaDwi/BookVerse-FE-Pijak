import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, BookOpen, Heart, Sparkles, Smile, Frown, Wind, Zap, HeartCrack } from "lucide-react";
import axios from "axios";
import BookCard from "@/components/book-card";
import { buildStorageUrl } from "@/lib/helper";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const emotionIcons = {
  happiness: <Smile className="w-16 h-16" />,
  joy: <Smile className="w-16 h-16" />,
  sadness: <Frown className="w-16 h-16" />,
  anxiety: <Wind className="w-16 h-16" />,
  fear: <Zap className="w-16 h-16" />,
  anger: <Zap className="w-16 h-16" />,
  love: <Heart className="w-16 h-16" />,
  relief: <Heart className="w-16 h-16" />,
  hope: <Sparkles className="w-16 h-16" />,
  loneliness: <HeartCrack className="w-16 h-16" />,
  gratitude: <Heart className="w-16 h-16" />,
  excitement: <Sparkles className="w-16 h-16" />,
  surprise: <Sparkles className="w-16 h-16" />,
  default: <Sparkles className="w-16 h-16" />
};

const emotionColors = {
  happiness: "text-yellow-500",
  joy: "text-yellow-500",
  sadness: "text-blue-500",
  anxiety: "text-orange-500",
  fear: "text-purple-500",
  anger: "text-red-500",
  love: "text-pink-500",
  relief: "text-green-500",
  hope: "text-teal-500",
  loneliness: "text-indigo-500",
  gratitude: "text-emerald-500",
  excitement: "text-amber-500",
  surprise: "text-cyan-500",
  default: "text-blue-600"
};

const BookLoadingAnimation = () => {
  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const loadingQuotes = [
    "Turning pages just for you...",
    "Finding your next adventure...",
    "Curating magical stories...",
    "Matching books with your soul...",
    "Almost there..."
  ];

  useEffect(() => {
    const pageInterval = setInterval(() => {
      setPage((prev) => (prev + 1) % 4);
    }, 500);
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(prev + 2, 100);
      });
    }, 100);

    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % loadingQuotes.length);
    }, 2000);
    
    return () => {
      clearInterval(pageInterval);
      clearInterval(progressInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-52 h-52 mb-8">
        <div className="absolute -bottom-4 left-4 right-4 h-4 bg-blue-200/50 blur-xl rounded-full" />
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-800 rounded-r-lg shadow-2xl transform origin-left transition-all duration-500"
             style={{ transform: `rotateY(${page * 8}deg)` }}>
          <div className="absolute inset-2 bg-gradient-to-t from-blue-800/50 to-transparent rounded-r" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-l-lg shadow-xl transform origin-right"
             style={{ transform: `rotateY(${-8 + page * 4}deg)` }}>
          <div className="absolute inset-3 border border-blue-100 rounded-l" />
          <div className="absolute right-2 top-4 bottom-4 w-px bg-blue-200" />
        </div>
        
        <div className="absolute inset-0 bg-white rounded-r-lg shadow-xl transform origin-left overflow-hidden"
             style={{ transform: `rotateY(${8 - page * 4}deg)` }}>
          <div className="absolute inset-3 border border-blue-100 rounded-r" />
          <div className="absolute inset-x-4 top-6 space-y-1.5 opacity-30">
            <div className="h-1.5 bg-blue-300 rounded w-3/4" />
            <div className="h-1.5 bg-blue-300 rounded w-full" />
            <div className="h-1.5 bg-blue-300 rounded w-5/6" />
            <div className="h-1.5 bg-blue-300 rounded w-2/3" />
          </div>
        </div>
        
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-blue-900 to-blue-800 rounded-l" />
        
        <div className="absolute -top-2 right-3 w-6 h-10 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-b-sm shadow-md transform -rotate-12" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <div className="w-7 h-7 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent font-poppins">
          {loadingQuotes[quoteIndex]}
        </h3>
        <p className="text-sm text-gray-400 font-poppins">
          Based on your unique mood
        </p>
      </div>
      
      <div className="w-72 mt-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1 font-poppins">
          <span>Analyzing mood</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-6">
        {[
          { active: progress >= 0 },
          { active: progress >= 33 },
          { active: progress >= 66 },
          { active: progress >= 100 }
        ].map((step, idx) => (
          <div key={idx} className="flex items-center">
            <div className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${step.active ? 'bg-blue-600 scale-110' : 'bg-gray-300'}
            `} />
            {idx < 3 && <div className={`w-6 h-px mx-1 transition-colors ${step.active ? 'bg-blue-300' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const emotion = searchParams.get("emotion") || "happiness";
  const confidence = searchParams.get("confidence") || "0";
  const mood = searchParams.get("mood") || "";

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      const startTime = Date.now();
      
      try {
        const response = await axios.post("/emotion/recommend", {
          emotion: emotion
        });
        
        if (response.data.success) {
          setBooks(response.data.data.books || []);
        } else {
          setError("Failed to get recommendations");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Connection error. Please try again.");
      } finally {
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 5000;
        
        if (elapsedTime < minLoadingTime) {
          setTimeout(() => {
            setLoading(false);
          }, minLoadingTime - elapsedTime);
        } else {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();
  }, [emotion]);

  const getEmotionIcon = () => {
    return emotionIcons[emotion] || emotionIcons.default;
  };

  const getEmotionColor = () => {
    return emotionColors[emotion] || emotionColors.default;
  };

  const getEmotionMessage = () => {
    const messages = {
      happiness: "We've picked uplifting stories that match your joyful mood!",
      sadness: "Here are comforting books to accompany you through this moment.",
      anxiety: "Find peace with these calming and reassuring reads.",
      fear: "Let these empowering stories give you strength.",
      love: "Warm your heart with these beautiful love stories.",
      anger: "Channel your energy with these powerful narratives.",
      relief: "Celebrate this freeing feeling with these light reads.",
      hope: "Stay inspired with these hopeful and optimistic stories.",
      loneliness: "These heartwarming tales will remind you that you're not alone.",
      gratitude: "Celebrate gratitude with these meaningful reads.",
      excitement: "Fuel your excitement with these thrilling adventures!",
      surprise: "Expect the unexpected with these surprising stories.",
      default: "Discover books selected just for you."
    };
    return messages[emotion] || messages.default;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
            <BookLoadingAnimation />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Heart className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group mb-6"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          <div className="text-center mb-10">
            <div className={`flex justify-center mb-4 ${getEmotionColor()}`}>
              {getEmotionIcon()}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-poppins capitalize">
              {emotion} Recommendations
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto font-poppins">
              {getEmotionMessage()}
            </p>
            {confidence > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">
                  Confidence: {confidence}% match with your mood
                </span>
              </div>
            )}
            {mood && (
              <p className="text-sm text-gray-400 mt-4 italic">
                Based on: "{decodeURIComponent(mood)}"
              </p>
            )}
          </div>

          {books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author?.split(',')[0] || book.author}
                  price={book.price}
                  rating={book.rating || 0}
                  image={buildStorageUrl(book.cover_img)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
              <p className="text-gray-500">Try a different mood or check back later.</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}