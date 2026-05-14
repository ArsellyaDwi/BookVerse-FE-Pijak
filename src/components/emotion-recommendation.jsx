import { useState } from "react";
import axios from "axios";
import { 
  Sparkles, 
  Heart, 
  Smile, 
  Frown, 
  Wind, 
  Zap, 
  BookOpen, 
  Send,
  Menu,
  X as CloseIcon
} from "lucide-react";
import BookCard from "@/components/book-card";
import { buildStorageUrl } from "@/lib/helper";

const API_KEY = "RAHASIA";
const API_BASE_URL = "http://localhost:8000";

const emotionIcons = {
  happiness: <Smile className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />,
  joy: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />,
  sadness: <Frown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-500" />,
  fear: <Wind className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-500" />,
  anxiety: <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-500" />,
  relief: <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-500" />,
  love: <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />,
  hope: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-teal-500" />,
  gratitude: <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pink-500" />,
};

const emotionColors = {
  happiness: "bg-yellow-100 text-yellow-800",
  joy: "bg-amber-100 text-amber-800",
  sadness: "bg-blue-100 text-blue-800",
  fear: "bg-purple-100 text-purple-800",
  anxiety: "bg-orange-100 text-orange-800",
  relief: "bg-green-100 text-green-800",
  love: "bg-red-100 text-red-800",
  hope: "bg-teal-100 text-teal-800",
  gratitude: "bg-pink-100 text-pink-800",
};

export default function EmotionRecommendation() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [emotions, setEmotions] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("detect");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePredict = async () => {
    if (!text.trim()) {
      setError("Please write something about how you feel");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const detectResponse = await axios.post(
        `${API_BASE_URL}/emotion/detect`,
        { text: text },
        { headers: { "x-api-key": API_KEY } }
      );

      console.log("Detection response:", detectResponse.data);

      if (detectResponse.data?.book_ids?.length > 0) {
        await fetchBooksDetails(detectResponse.data.book_ids);
      }

      setEmotions(["Relief", "Happiness"]);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Failed to detect emotion");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksDetails = async (bookIds) => {
    try {
      const bookPromises = bookIds.slice(0, 6).map(async (id) => {
        const response = await axios.get(`http://localhost:8000/api/books/${id}`);
        return response.data?.data || response.data;
      });
      const books = await Promise.all(bookPromises);
      setRecommendedBooks(books.filter(b => b));
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const tabs = [
    { id: "detect", label: "Detect Emotion", icon: <Sparkles className="w-4 h-4" /> },
    { id: "recommend", label: "Book Recommendations", icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-poppins">
      
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BookVerse AI
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 lg:gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm lg:text-base">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Slide-in Menu */}
          <div
            className={`fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
              mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="flex flex-col p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        
        {/* Responsive Container */}
        <div className="max-w-4xl mx-auto">
          
          {/* Detect Emotion Tab */}
          {activeTab === "detect" && (
            <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 transition-all duration-300">
              {/* Header */}
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  How are you feeling today?
                </h2>
                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                  Write about your mood, and our AI will detect your emotions and recommend books
                </p>
              </div>

              {/* Textarea Input */}
              <div className="mb-6">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="e.g., I'm feeling anxious about my job interview tomorrow..."
                  rows={5}
                  className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                />
                {/* Character counter */}
                <div className="flex justify-end mt-2">
                  <span className={`text-xs ${text.length > 0 ? "text-blue-500" : "text-gray-400"}`}>
                    {text.length} characters
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Analyzing your mood...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Detect Emotion</span>
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Detected Emotions Results */}
              {emotions.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                    Detected Emotions:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {emotions.map((emo, idx) => (
                      <span
                        key={idx}
                        className={`px-4 py-2 rounded-full capitalize flex items-center gap-2 text-sm sm:text-base ${
                          emotionColors[emo.toLowerCase()] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {emotionIcons[emo.toLowerCase()]}
                        {emo}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Book Recommendations Tab */}
          {activeTab === "recommend" && (
            <div>
              {/* Header */}
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  Books Recommended for You
                </h2>
                <p className="text-sm sm:text-base text-gray-500">
                  Based on your emotional profile
                </p>
              </div>

              {/* Books Grid - Responsive */}
              {recommendedBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
                  {recommendedBooks.map((book) => (
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
                // Empty State
                <div className="text-center py-12 md:py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                    No recommendations yet
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                    Switch to "Detect Emotion" tab and tell us how you feel to get personalized book recommendations.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}