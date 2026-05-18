import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { Search, Grid3x3, List, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BlogCard from "@/components/blog-card";
import BlogSidebar from "@/components/blog-sidebar";
import { fetchBlogPosts, searchBlogPosts } from "@/services/blog-service";

const BlogSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-2xl h-64 w-full mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get("q") || "");
  const [localKeyword, setLocalKeyword] = useState(searchParams.get("q") || "");
  const [recentPosts, setRecentPosts] = useState([]);

  const postsPerPage = 9;

  useEffect(() => {
    loadPosts();
    loadRecentPosts();
  }, [currentPage, searchKeyword]);

  const loadPosts = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      per_page: postsPerPage,
      ...(searchKeyword && { search: searchKeyword }),
    };
    const result = await fetchBlogPosts(params);
    if (result.success) {
      setPosts(result.data);
      setTotalPages(result.pagination?.last_page || 1);
    }
    setLoading(false);
  };

  const loadRecentPosts = async () => {
    const result = await fetchBlogPosts({ per_page: 5, sort: "latest" });
    if (result.success) {
      setRecentPosts(result.data);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(localKeyword);
    setSearchParams({ q: localKeyword });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              BookVerse Journal
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
              Discover insights, stories, and inspiration from the world of books and reading
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Search Bar Mobile */}
        <div className="lg:hidden mb-6">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header with View Toggle */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Latest Articles
                </h2>
                {searchKeyword && (
                  <p className="text-sm text-gray-500 mt-1">
                    Showing results for: <span className="font-medium">"{searchKeyword}"</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Posts Grid/List */}
            {loading ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
              }>
                {[...Array(6)].map((_, i) => (
                  <BlogSkeleton key={i} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
              }>
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} variant={viewMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500">Try different search keywords or browse all categories</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 pt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600 mx-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <BlogSidebar onSearch={handleSearch} recentPosts={recentPosts} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}