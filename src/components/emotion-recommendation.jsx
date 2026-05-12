import { useState } from "react";
import axios from "axios";
import { Sparkles, Heart, Smile, Frown, Wind, Zap, BookOpen, Send } from "lucide-react";
import BookCard from "@/components/book-card";
import { buildStorageUrl } from "@/lib/helper";

const API_KEY = "RAHASIA";
const API_BASE_URL = "http://localhost:8000";

const emotionIcons = {
  happiness: <Smile className="w-6 h-6 text-yellow-500" />,
  joy: <Sparkles className="w-6 h-6 text-yellow-500" />,
  sadness: <Frown className="w-6 h-6 text-blue-500" />,
  fear: <Wind className="w-6 h-6 text-purple-500" />,
  anxiety: <Zap className="w-6 h-6 text-orange-500" />,
  relief: <Heart className="w-6 h-6 text-green-500" />,
  love: <Heart className="w-6 h-6 text-red-500" />,
  hope: <Sparkles className="w-6 h-6 text-teal-500" />,
  gratitude: <Heart className="w-6 h-6 text-pink-500" />,
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

  const handlePredict = async () => {
    if (!text.trim()) {
      setError("Please write something about how you feel");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const detectResponse = await axios.post(
        `${API_BASE_URL}/recommend`,
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

  return (
    <div className="max-w-6xl mx-auto p-6 font-poppins">
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("detect")}
          className={`pb-3 px-4 font-medium transition-all ${
            activeTab === "detect"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles className="w-5 h-5 inline mr-2" />
          Detect Emotion
        </button>
        <button
          onClick={() => setActiveTab("recommend")}
          className={`pb-3 px-4 font-medium transition-all ${
            activeTab === "recommend"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <BookOpen className="w-5 h-5 inline mr-2" />
          Book Recommendations
        </button>
      </div>

      {/* Detect Emotion Tab */}
      {activeTab === "detect" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            How are you feeling today?
          </h2>
          <p className="text-gray-500 mb-4">
            Write about your mood, and our AI will detect your emotions
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., I'm feeling anxious about my job interview tomorrow..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />

          <button
            onClick={handlePredict}
            disabled={loading}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Detect Emotion</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Results */}
          {emotions.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Detected Emotions:</h3>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emo, idx) => (
                  <span
                    key={idx}
                    className={`px-4 py-2 rounded-full capitalize flex items-center gap-2 ${
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
      {activeTab === "recommend" && recommendedBooks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Books Recommended for You 📚
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
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
        </div>
      )}
    </div>
  );
}