import { useState, useEffect } from "react";
import { Search, ChevronRight, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import { fetchCategories, searchBlogPosts } from "@/services/blog-service";

export default function BlogSidebar({ onSearch, recentPosts = [] }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const result = await fetchCategories();
      if (result.success) {
        setCategories(result.data);
      }
      setIsLoading(false);
    };
    loadCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      onSearch(searchKeyword);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Widget */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Search Articles</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search blog posts..."
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/blog/category/${category.slug}`}
                  className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors text-sm py-1"
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-400">({category.posts_count || 0})</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Posts Widget */}
      {recentPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Posts</h3>
          <ul className="space-y-3">
            {recentPosts.slice(0, 5).map((post) => (
              <li key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(post.published_at)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};