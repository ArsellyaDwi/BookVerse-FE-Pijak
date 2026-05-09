import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { 
  ArrowLeft, 
  Search, 
  BookOpen,
  Filter,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { buildStorageUrl } from "@/lib/helper";
import BookCard from "@/components/book-card";
import useQuery from "@/hooks/use-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const ShimmerCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg h-[300px] w-full"></div>
    <div className="mt-3 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

const ShimmerLoading = ({ count = 10 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {[...Array(count)].map((_, index) => (
      <ShimmerCard key={index} />
    ))}
  </div>
);

export default function GenreDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("search") || ""
  );
  const [localKeyword, setLocalKeyword] = useState(
    searchParams.get("search") || ""
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [allBooks, setAllBooks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const itemsPerPage = 12;
  const searchTimeoutRef = useState(null);

  // Get genre info
  const getGenre = useQuery({
    url: `genre/${slug}`,
    method: "GET",
    immediate: !!slug,
  });

  // Get all books
  const getBooks = useQuery({
    url: `genres/${slug}/books`,
    method: "GET",
    params: {
      limit: 500,
    },
    immediate: !!slug,
    onSuccess: (data) => {
      setAllBooks(data || []);
    },
  });

  const genre = getGenre.data;
  const isLoading = getGenre.loading || getBooks.loading;

  const filteredAndSortedBooks = useMemo(() => {
    if (!allBooks.length) return [];
    
    let result = [...allBooks];
    
    // Filter (search)
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(book => 
        book.title?.toLowerCase().includes(keyword) ||
        book.author?.toLowerCase().includes(keyword) ||
        book.description?.toLowerCase().includes(keyword)
      );
    }
    
    // Sort
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price_desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "title_asc":
        result.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      case "title_desc":
        result.sort((a, b) => b.title?.localeCompare(a.title));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "latest":
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }
    
    return result;
  }, [allBooks, searchKeyword, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredAndSortedBooks.slice(startIndex, startIndex + itemsPerPage);

  // Update URL & reset page
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchKeyword) params.set("search", searchKeyword);
    if (sortBy && sortBy !== "latest") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
    setCurrentPage(1);
  }, [searchKeyword, sortBy]);

  const handleSearchChange = useCallback((value) => {
    setLocalKeyword(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(true);
      setSearchKeyword(value);
      setTimeout(() => setIsSearching(false), 100);
    }, 300);
  }, []);

  const clearSearch = () => {
    setLocalKeyword("");
    setSearchKeyword("");
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const sortOptions = [
    { value: "latest", label: "Latest Releases" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "title_asc", label: "Title: A to Z" },
    { value: "title_desc", label: "Title: Z to A" },
    { value: "rating", label: "Highest Rated" },
  ];

  if (isLoading && !allBooks.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
          <ShimmerLoading count={12} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!genre && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-20">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Genre not found</h3>
            <p className="text-gray-500">Genre "{slug}" does not exist</p>
            <button onClick={handleBack} className="mt-4 text-blue-600">Go Back</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-6"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Genres</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">
              {genre?.name}
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto font-poppins">
              Explore our collection of {genre?.name} books.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{allBooks.length} Books</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search Input */}
          <div className="relative w-full md:flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={localKeyword}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search ${allBooks.length} books by title, author...`}
              className="w-full pl-12 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-poppins"
            />
            {localKeyword && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-3 border border-gray-200 rounded-xl outline-none font-poppins text-sm bg-white cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="text-sm text-gray-500">
            {isSearching ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                Searching...
              </span>
            ) : searchKeyword ? (
              <span>
                Found <strong className="text-gray-900">{filteredAndSortedBooks.length}</strong> books matching "{searchKeyword}"
              </span>
            ) : (
              <span>
                <strong className="text-gray-900">{allBooks.length}</strong> books in {genre?.name}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedBooks.length)} of {filteredAndSortedBooks.length}
          </div>
        </div>

        {/* Books Grid */}
        {paginatedBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {paginatedBooks.map((book) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
            <p className="text-gray-500">
              {searchKeyword 
                ? `No books match "${searchKeyword}" in ${genre?.name} genre.` 
                : `No books available in ${genre?.name} genre yet.`
              }
            </p>
            {searchKeyword && (
              <button
                onClick={clearSearch}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 lg:hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Sort Options</h3>
              <button onClick={() => setIsFilterOpen(false)} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <select
                value={sortBy}
                onChange={(e) => {
                  handleSortChange(e);
                  setIsFilterOpen(false);
                }}
                className="w-full px-4 py-3 border rounded-xl"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}