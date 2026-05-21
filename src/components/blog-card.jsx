import { Link } from "react-router";
import { useState } from "react";
import { Calendar, User, Clock, Eye, Heart, ChevronRight, Bookmark, Share2 } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getCategoryColor = (category) => {
  const colors = {
    "Book Review": "bg-amber-100 text-amber-700",
    "Reading Tips": "bg-emerald-100 text-emerald-700",
    "Story": "bg-indigo-100 text-indigo-700",
    "Research": "bg-sky-100 text-sky-700",
    "News": "bg-rose-100 text-rose-700",
    "Interview": "bg-violet-100 text-violet-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

export default function BlogCard({ post, variant = "grid" }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  if (variant === "list") {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 lg:w-72 flex-shrink-0 overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <ImageWithFallback
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
          <div className="flex-1 p-6 md:p-7">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{post.read_time || "5 min read"}</span>
                </div>
              </div>
              <button
                onClick={handleBookmark}
                className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600 text-blue-600" : ""}`} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
              {post.short_description || post.excerpt}
            </p>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                    {post.author?.charAt(0) || "A"}
                  </div>
                  <span>{post.author?.name || post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{post.likes || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <ImageWithFallback
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-md ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
        
        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
        >
          <Bookmark className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-5">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(post.published_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.read_time || "5 min"}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">
          {post.short_description || post.excerpt}
        </p>
        
        {/* Author & Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
              {post.author?.charAt(0) || "A"}
            </div>
            <span className="text-xs text-gray-500 truncate max-w-[100px]">
              {post.author?.name || post.author}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 text-gray-400 text-xs">
              <Eye className="w-3 h-3" />
              <span>{post.views || 0}</span>
            </div>
            <div className="flex items-center gap-0.5 text-gray-400 text-xs">
              <Heart className="w-3 h-3" />
              <span>{post.likes || 0}</span>
            </div>
          </div>
        </div>
        
        {/* Read More Link */}
        <div className="mt-3 flex items-center justify-end">
          <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
            Read More
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}