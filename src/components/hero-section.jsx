import { useState } from "react";
import { Sparkles, Waves, Wind, Zap, Heart } from "lucide-react";

export default function HeroSection() {
  const [moodInput, setMoodInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [activeMood, setActiveMood] = useState("");

  const characterLimit = 300;
  const moods = [
    { label: "Mellow", icon: <Waves size={14} /> },
    { label: "Chill", icon: <Wind size={14} /> },
    { label: "Ambitious", icon: <Zap size={14} /> },
    { label: "Hopeful", icon: <Heart size={14} /> },
  ];

  const handleMoodClick = (mood) => {
    setActiveMood(mood);
    setMoodInput(`I'm looking for a ${mood.toLowerCase()} atmosphere...`);
  };

  return (
    <section className="bg-white pt-16 pb-8 font-poppins">
      {/* Container Utama - Mengikuti Spacing Best Sellers */}
      <div className="max-w-[1440px] mx-auto px-20">
        
        {/* Background Decor - Halus & Terkontrol */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
          <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-[#2563EB]/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-blue-50 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full text-center flex flex-col items-center">
          
          {/* Headline Editorial */}
          <h1 className="text-[#333333] text-[56px] md:text-[80px] font-bold mb-10 tracking-tight leading-[1.1]">
            Find the story <br />
            that matches your <span className="text-[#2563EB] italic font-medium">inner world</span>
          </h1>

          {/* SEARCH CONTAINER - Gaya Border Tegas & Seamless */}
          <div 
            className={`
              w-full max-w-[800px] bg-white rounded-[24px] p-6 transition-all duration-500 border-2
              ${isFocused 
                ? "shadow-[0_20px_50px_-10px_rgba(37,99,235,0.12)] border-[#2563EB]/30 scale-[1.01]" 
                : "shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] border-gray-100"
              }
            `}
          >
            <div className="flex flex-col gap-4 text-left">
              
              {/* Input Area - Formal Typography */}
              <div className="flex items-start gap-4 px-2">
                <textarea
                  rows="1"
                  value={moodInput}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setMoodInput(e.target.value)}
                  placeholder="Describe the atmosphere you're looking for..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-[#333333] text-lg placeholder:text-gray-300 py-1 font-medium leading-relaxed"
                />
              </div>

              {/* Bottom Actions - Terstruktur sesuai 8pt Grid */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                
                {/* Mood Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {moods.map((mood) => (
                    <button 
                      key={mood.label}
                      onClick={() => handleMoodClick(mood.label)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all border
                        ${activeMood === mood.label 
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                          : "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-600"}`}
                    >
                      <span className="opacity-60">{mood.icon}</span>
                      {mood.label}
                    </button>
                  ))}
                </div>

                {/* Info & Action Button */}
                <div className="flex items-center gap-5">
                  <span className="text-gray-300 font-bold text-[10px] uppercase tracking-widest">
                    {moodInput.length} / {characterLimit}
                  </span>
                  
                  <button
                    className={`p-3 rounded-full transition-all duration-300 
                      ${moodInput.trim().length >= 5
                        ? "bg-[#2563EB] text-white shadow-lg shadow-blue-100" 
                        : "bg-gray-50 text-gray-300 cursor-default"}`}
                  >
                    <Sparkles size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <p className="mt-10 text-[#64748B] text-xs font-medium tracking-wide">
            Our AI tailors recommendations based on your unique emotional profile.
          </p>
        </div>

        {/* Section Divider - Mengikuti Best Sellers */}
        <div className="h-px bg-gray-300 mt-16 w-full" />
      </div>
    </section>
  );
}