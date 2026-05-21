// src/components/BlogSidebar.jsx

import { useState } from "react";
import { Search, ChevronRight, Calendar } from "lucide-react";
import { Link } from "react-router";
import useQuery from "@/hooks/use-query";
import useQueryPagination from "@/hooks/use-query-pagination";
import { ImageWithFallback } from "./image-with-fallback";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function BlogSidebar({ onSearch, recentPosts: externalRecentPosts, loading: externalLoading }) {
  const [searchKeyword, setSearchKeyword] = useState("");

  // Fetch categories using useQuery
  const { 
    data: categoriesData, 
    loading: categoriesLoading 
  } = useQuery({
    url: "blog/categories",
    method: "GET",
    immediate: true,
  });

  // Fetch recent posts using useQueryPagination (internal jika tidak ada props)
  const { 
    data: internalRecentPosts, 
    loading: internalRecentLoading 
  } = useQueryPagination({
    url: "blog/posts",
    method: "GET",
    params: {
      per_page: 5,
      sort_by: "published_at",
      sort_direction: "desc",
    },
    paginated: false,
    immediate: !externalRecentPosts, // Only fetch if no external props
  });

  // Use external recentPosts if provided, otherwise use internal
  const recentPosts = externalRecentPosts || internalRecentPosts || [];
  const isLoadingRecent = externalLoading !== undefined ? externalLoading : internalRecentLoading;

  // Extract categories from response
  const categories = categoriesData?.data || categoriesData?.categories || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      onSearch?.(searchKeyword);
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
        {categoriesLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/blog/category/${category.slug}`}
                  className="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors text-sm py-1 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-400">({category.posts_count || 0})</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No categories found</p>
        )}
      </div>

      {/* Recent Posts Widget */}
      {!isLoadingRecent && recentPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Posts</h3>
          <ul className="space-y-3">
            {recentPosts.slice(0, 5).map((post) => (
              <li key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200 hover:translate-x-1"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <ImageWithFallback
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-400">{formatDate(post.published_at)}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loading state for recent posts */}
      {isLoadingRecent && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Posts</h3>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}