import { Link } from "react-router";
import { useState } from "react";
import { Calendar, User, Clock, Eye, Heart, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const getCategoryColor = (category) => {
  const colors = {
    "Book Review": "bg-blue-100 text-blue-700",
    "Reading Tips": "bg-green-100 text-green-700",
    "Story": "bg-purple-100 text-purple-700",
    "Research": "bg-orange-100 text-orange-700",
    "News": "bg-red-100 text-red-700",
    "Interview": "bg-pink-100 text-pink-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

export default function BlogCard({ post, variant = "grid" }) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === "list") {
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-72 lg:w-80 flex-shrink-0 overflow-hidden rounded-2xl">
            <div className="aspect-video w-full overflow-hidden">
              <ImageWithFallback
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
          <div className="flex-1 p-6 pt-0 md:pt-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>{post.read_time || "5 min read"}</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
              {post.short_description || post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
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
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-video w-full overflow-hidden">
          <ImageWithFallback
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px]">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {post.short_description || post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.read_time || "5 min"}</span>
            </div>
          </div>
          <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}