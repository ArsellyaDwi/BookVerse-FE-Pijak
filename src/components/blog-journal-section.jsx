import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, Calendar, User, Clock, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";
import { fetchBlogPosts } from "@/services/blogService";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getCategoryColor = (category) => {
  const colors = {
    "Book Review": "bg-blue-100 text-blue-700",
    "Reading Tips": "bg-green-100 text-green-700",
    "Story": "bg-purple-100 text-purple-700",
    "Research": "bg-orange-100 text-orange-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

export default function BlogJournalSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const result = await fetchBlogPosts({ per_page: 3 });
      if (result.success) {
        setPosts(result.data);
      }
      setLoading(false);
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-5 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              BookVerse Journal
            </h2>
            <p className="text-gray-500 mt-1">Latest articles and insights from our team</p>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-video">
                <ImageWithFallback
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.read_time || "5 min read"}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {post.short_description || post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Read More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}