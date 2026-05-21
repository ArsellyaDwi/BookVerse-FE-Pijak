import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import { Search, Grid3x3, List, ChevronLeft, ChevronRight, BookOpen, Filter, X } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BlogCard from "@/components/blog-card";
import BlogSidebar from "@/components/blog-sidebar";
import useQueryPagination from "@/hooks/use-query-pagination";
import useQuery from "@/hooks/use-query";

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

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            !selectedCategory
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === category.slug
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category.name}
            {category.posts_count > 0 && (
              <span className="ml-1 text-xs opacity-70">({category.posts_count})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get("q") || "");
  const [localKeyword, setLocalKeyword] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const postsPerPage = 9;

  // Build query params for blog posts
  const buildQueryParams = () => {
    const params = {
      per_page: postsPerPage,
    };
    
    if (searchKeyword) {
      params.search = searchKeyword;
    }
    
    if (selectedCategory && selectedCategory !== "all") {
      params.category = selectedCategory;
    }
    
    return params;
  };

  // Fetch blog posts with pagination
  const {
    data: posts,
    loading: postsLoading,
    pagination,
    loadMore,
    hasNextPage,
    totalItems,
    refetch: refetchPosts,
  } = useQueryPagination({
    url: "blog/posts",
    method: "GET",
    params: buildQueryParams(),
    paginated: true,
    immediate: true,
  });

  // Fetch categories
  const { data: categoriesData, loading: categoriesLoading } = useQuery({
    url: "blog/categories",
    method: "GET",
    immediate: true,
  });

  // Fetch recent posts for sidebar
  const { data: recentPosts, loading: recentLoading } = useQueryPagination({
    url: "blog/posts",
    method: "GET",
    params: {
      per_page: 5,
      sort_by: "published_at",
      sort_direction: "desc",
    },
    paginated: false,
    immediate: true,
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchKeyword) params.set("q", searchKeyword);
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    setSearchParams(params, { replace: true });
  }, [searchKeyword, selectedCategory, setSearchParams]);

  // Refetch when filters change
  useEffect(() => {
    refetchPosts(buildQueryParams());
  }, [searchKeyword, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(localKeyword);
  };

  const handleCategorySelect = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setSearchKeyword("");
    setLocalKeyword("");
  };

  const clearFilters = () => {
    setSearchKeyword("");
    setLocalKeyword("");
    setSelectedCategory("");
  };

  const hasActiveFilters = searchKeyword || selectedCategory;

  const categories = categoriesData?.data || categoriesData?.categories || [];

  // For pagination display
  const currentPage = pagination?.current_page || 1;
  const lastPage = pagination?.last_page || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-16 md:py-20">
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
            {hasActiveFilters && (
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                {searchKeyword && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                    Search: {searchKeyword}
                    <button onClick={() => setSearchKeyword("")} className="ml-1 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory("")} className="ml-1 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-white/80 hover:text-white underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
        
        {/* Mobile Search and Filter Bar */}
        <div className="lg:hidden mb-6">
          <form onSubmit={handleSearch} className="relative mb-3">
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
          
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full justify-center"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {[searchKeyword, selectedCategory].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              {/* Search Box Desktop */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Search Articles</h3>
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                    placeholder="Search by title, author..."
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Categories Filter */}
              {!categoriesLoading && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                  />
                </div>
              )}

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 text-center text-red-600 hover:text-red-700 text-sm font-medium bg-white rounded-xl border border-gray-100 shadow-sm transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto lg:hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Search in drawer */}
                <div className="mb-5">
                  <h4 className="font-semibold text-gray-700 mb-2">Search</h4>
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={localKeyword}
                      onChange={(e) => setLocalKeyword(e.target.value)}
                      placeholder="Search articles..."
                      className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-md"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
                
                {/* Categories in drawer */}
                {!categoriesLoading && (
                  <div className="mb-5">
                    <h4 className="font-semibold text-gray-700 mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCategorySelect("")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          !selectedCategory
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.slug)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedCategory === category.slug
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    clearFilters();
                    setIsFilterOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-red-600 hover:text-red-700 text-sm font-medium border-t border-gray-100 pt-4 mt-2"
                >
                  Clear All Filters
                </button>
              </div>
            </>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with View Toggle & Results Count */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {searchKeyword ? "Search Results" : selectedCategory ? selectedCategory : "Latest Articles"}
                </h2>
                {!postsLoading && posts && (
                  <p className="text-sm text-gray-500 mt-1">
                    Found {totalItems} article{totalItems !== 1 ? "s" : ""}
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
            {postsLoading ? (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-6"
              }>
                {[...Array(6)].map((_, i) => (
                  <BlogSkeleton key={i} />
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <>
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-6"
                }>
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} variant={viewMode} />
                  ))}
                </div>

                {/* Load More / Pagination */}
                <div className="mt-10 text-center">
                  {postsLoading && (
                    <div className="mb-4">
                      <div className="inline-flex items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Loading more...</span>
                      </div>
                    </div>
                  )}

                  {!postsLoading && hasNextPage && (
                    <button
                      onClick={() => loadMore()}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      Load More ({currentPage} / {lastPage})
                    </button>
                  )}

                  {!hasNextPage && posts && posts.length > 0 && (
                    <div className="py-6">
                      <p className="text-gray-500">You've reached the end of {totalItems} articles</p>
                    </div>
                  )}

                  {posts && !hasNextPage && totalItems > 0 && (
                    <div className="mt-4 text-sm text-gray-400">
                      Showing all {totalItems} articles
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500">Try different search keywords or browse all categories</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop (Recent Posts) */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <BlogSidebar 
              onSearch={(keyword) => {
                setSearchKeyword(keyword);
                setLocalKeyword(keyword);
              }}
              recentPosts={recentPosts}
              loading={recentLoading}
            />
          </div>
        </div>

        {/* Mobile Recent Posts (shown below content on mobile) */}
        <div className="lg:hidden mt-8">
          <BlogSidebar 
            onSearch={(keyword) => {
              setSearchKeyword(keyword);
              setLocalKeyword(keyword);
            }}
            recentPosts={recentPosts}
            loading={recentLoading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}