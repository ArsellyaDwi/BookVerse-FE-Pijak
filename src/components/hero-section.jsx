import { useState } from "react";
import { Sparkles, Search } from "lucide-react";

export default function HeroSection({ onMoodSearch }) {
  const [moodInput, setMoodInput] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const moodTags = [
    { label: "Mellow Mood", emoji: "🌊" },
    { label: "Feeling Chill", emoji: "🍃" },
    { label: "Ambitious", emoji: "🔥" },
    { label: "Hopeful", emoji: "✨" },
  ];

  const handleSearch = () => {
    if (moodInput.trim()) {
      if (onMoodSearch) {
        onMoodSearch(moodInput);
      }
      alert(`AI is finding books for your mood: "${moodInput}" 🤖✨`);
    }
  };

  const handleTagClick = (tag) => {
    setMoodInput(tag);
    if (onMoodSearch) {
      onMoodSearch(tag);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-white">
      {/* Content Container */}
      <div className="relative max-w-4xl mx-auto px-6 py-20 text-center z-10">
        {/* Main Headline */}
        <h1 className="font-sans text-5xl md:text-6xl font-bold text-gray-900 mb-12 tracking-tight">
          How are you
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            feeling today?
          </span>
        </h1>

        {/* Search Bar Card */}
        <div
          className={`
            bg-white/80 backdrop-blur-sm rounded-2xl p-2 pl-6
            flex items-center gap-3 mb-10
            transition-all duration-300 ease-out
            border border-gray-100
            ${
              isHovered
                ? "shadow-xl scale-[1.02] -translate-y-1 border-gray-200"
                : "shadow-lg border-gray-100"
            }
          `}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Search Icon */}
          <Search size={20} className="text-gray-400 flex-shrink-0" />

          {/* Input Field */}
          <input
            type="text"
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Feeling mellow like a character from The Midnight Library..."
            className="flex-1 font-sans text-base text-gray-900 bg-transparent border-none outline-none py-4 px-2 placeholder:text-gray-400"
          />

          {/* Ask AI Button */}
          <button
            onClick={handleSearch}
            className="
              flex items-center gap-2
              bg-gradient-to-r from-purple-600 to-blue-600
              text-white font-semibold py-3 px-6 rounded-xl
              transition-all duration-300 hover:scale-105
              shadow-md hover:shadow-lg
              flex-shrink-0 text-sm md:text-base
            "
          >
            <Sparkles size={18} />
            Ask AI
          </button>
        </div>

        {/* Mood Quick Tags/Chips */}
        <div className="flex justify-center flex-wrap gap-3">
          {moodTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag.label)}
              className="
                bg-white/80 backdrop-blur-sm
                text-gray-700 font-medium
                px-6 py-3 rounded-full
                transition-all duration-300
                hover:scale-105 hover:-translate-y-1
                shadow-sm hover:shadow-md
                flex items-center gap-2
                border border-gray-200
                text-sm
              "
            >
              <span className="text-lg">{tag.emoji}</span>
              {tag.label}
            </button>
          ))}
        </div>

        {/* Helper Text */}
        <p className="font-sans text-sm text-gray-500 mt-8">
          💡 Our AI will recommend books that match your mood
        </p>
      </div>
    </div>
  );
}
