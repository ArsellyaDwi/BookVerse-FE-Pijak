import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router";
import {
  ArrowRight,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Star,
  Search,
} from "lucide-react";
import BookCard from "@/components/book-card";
import useQueryPagination from "@/hooks/use-query-pagination";
import { buildStorageUrl } from "@/lib/helper";
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

export default function BookListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get("keyword") || ""
  );
  const [localKeyword, setLocalKeyword] = useState(
    searchParams.get("keyword") || ""
  );
  const isFirstLoadRef = useRef(true);

  const [filters, setFilters] = useState({
    genres: searchParams.get("genres")
      ? searchParams.get("genres").split(",")
      : [],
    language: searchParams.get("language") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    min_rating: searchParams.get("min_rating") || "",
    sort_by: searchParams.get("sort_by") || "",
    sort_direction: searchParams.get("sort_direction") || "asc",
  });

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [location.pathname, location.search]);

  const [filterOptions, setFilterOptions] = useState({
    genres: [],
    languages: [],
    price_range: { min: 0, max: 1000000 },
    rating_range: { min: 0, max: 5 },
  });

  const { data: initData, loading: initLoading } = useQuery({
    url: "books/init",
    method: "GET",
    immediate: true,
    onSuccess: (data) => {
      setFilterOptions({
        genres: data.genres || [],
        languages: data.languages || [],
        price_range: data.price_range || { min: 0, max: 1000000 },
        rating_range: data.rating_range || { min: 0, max: 5 },
      });

      if (!searchParams.toString()) {
        setFilters((prev) => ({
          ...prev,
          min_price: data.price_range?.min?.toString() || "",
          max_price: data.price_range?.max?.toString() || "",
        }));
      }
    },
  });

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const buildQueryParams = () => {
    const params = {};
    if (searchKeyword) params.keyword = searchKeyword;
    if (filters.genres.length) params.genres = filters.genres.join(",");
    if (filters.language) params.language = filters.language;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.min_rating) params.min_rating = filters.min_rating;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.sort_direction) params.sort_direction = filters.sort_direction;
    params.per_page = 12;
    return params;
  };

  const {
    data: books,
    loading,
    pagination,
    loadMore,
    hasNextPage,
    totalItems,
    refetch: refetchBooks,
  } = useQueryPagination({
    url: "books",
    method: "GET",
    params: buildQueryParams(),
    paginated: true,
    immediate: true,
  });

  const handleSearch = () => {
    setSearchKeyword(localKeyword);
  };

  const handleKeywordChange = (value) => {
    setLocalKeyword(value);
  };

  useEffect(() => {
    if (isFirstLoadRef.current) {
      if (searchParams.toString()) {
        refetchBooks(buildQueryParams());
      }
      isFirstLoadRef.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (searchKeyword) params.set("keyword", searchKeyword);
    if (filters.genres.length) params.set("genres", filters.genres.join(","));
    if (filters.language) params.set("language", filters.language);
    if (filters.min_price) params.set("min_price", filters.min_price);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.min_rating) params.set("min_rating", filters.min_rating);
    if (filters.sort_by) params.set("sort_by", filters.sort_by);
    if (filters.sort_direction)
      params.set("sort_direction", filters.sort_direction);
    setSearchParams(params, { replace: true });

    refetchBooks(buildQueryParams());
  }, [
    searchKeyword,
    filters.min_price,
    filters.max_price,
    filters.genres,
    filters.language,
    filters.min_rating,
    filters.sort_by,
    filters.sort_direction,
  ]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenreToggle = (genreId) => {
    setFilters((prev) => {
      const newGenres = prev.genres.includes(genreId.toString())
        ? prev.genres.filter((id) => id !== genreId.toString())
        : [...prev.genres, genreId.toString()];
      return { ...prev, genres: newGenres };
    });
  };

  const clearFilters = () => {
    setLocalKeyword("");
    setSearchKeyword("");

    setFilters({
      genres: [],
      language: "",
      min_price: filterOptions.price_range.min.toString(),
      max_price: filterOptions.price_range.max.toString(),
      min_rating: "",
      sort_by: "",
      sort_direction: "asc",
    });
  };

  const hasActiveFilters = () => {
    return (
      searchKeyword ||
      filters.genres.length > 0 ||
      filters.language ||
      filters.min_rating ||
      filters.min_price !== filterOptions.price_range.min.toString() ||
      filters.max_price !== filterOptions.price_range.max.toString()
    );
  };

  const sortOptions = [
    { value: "title", label: "Title" },
    { value: "price", label: "Price" },
    { value: "rating", label: "Rating" },
    { value: "publish_date", label: "Publish Date" },
  ];

  const showShimmer = initLoading && !filterOptions.genres.length;
  const showBooksLoading = loading && !books;

  if (showShimmer) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {hasActiveFilters() && (
              <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {filters.genres.length +
                  (filters.language ? 1 : 0) +
                  (filters.min_rating ? 1 : 0)}
              </span>
            )}
          </button>

          <div className="text-sm text-gray-600">
            {!showBooksLoading && books && (
              <span>{totalItems} books found</span>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          <div
            className={`fixed inset-y-0 left-0 z-50 w-full max-w-md bg-white transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isFilterOpen ? "translate-x-0" : "-translate-x-full"
            } lg:relative lg:translate-x-0 lg:block lg:w-72 lg:overflow-y-visible`}
          >
            <div className="h-full lg:h-auto lg:sticky lg:top-24 p-6 border-r border-gray-200">
              <div className="flex items-center justify-between lg:hidden mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Books
                </label>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={localKeyword}
                    onChange={(e) => handleKeywordChange(e.target.value)}
                    placeholder="Search by title, author, or description..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Genres
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filterOptions.genres.map((genre) => (
                    <label
                      key={genre.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre.id.toString())}
                        onChange={() => handleGenreToggle(genre.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {genre.name}
                      </span>
                      {genre.books_count && (
                        <span className="text-xs text-gray-400">
                          ({genre.books_count})
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) =>
                    handleFilterChange("language", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Languages</option>
                  {filterOptions.languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range (Rupiah)
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={filters.min_price}
                      onChange={(e) =>
                        handleFilterChange("min_price", e.target.value)
                      }
                      placeholder={formatRupiah(filterOptions.price_range.min)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={filters.max_price}
                      onChange={(e) =>
                        handleFilterChange("max_price", e.target.value)
                      }
                      placeholder={formatRupiah(filterOptions.price_range.max)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Range: {formatRupiah(filterOptions.price_range.min)} -{" "}
                  {formatRupiah(filterOptions.price_range.max)}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        handleFilterChange("min_rating", rating.toString())
                      }
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg border transition-all ${
                        filters.min_rating === rating.toString()
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <Star
                        className={`w-3 h-3 ${
                          filters.min_rating === rating.toString()
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      <span className="text-sm">{rating}+</span>
                    </button>
                  ))}
                  {filters.min_rating && (
                    <button
                      onClick={() => handleFilterChange("min_rating", "")}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort By
                </label>
                <div className="space-y-2">
                  <select
                    value={filters.sort_by}
                    onChange={(e) =>
                      handleFilterChange("sort_by", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Default</option>
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {filters.sort_by && (
                    <button
                      onClick={() =>
                        handleFilterChange(
                          "sort_direction",
                          filters.sort_direction === "asc" ? "desc" : "asc"
                        )
                      }
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      {filters.sort_direction === "asc" ? (
                        <>
                          <ChevronUp className="w-4 h-4" /> Ascending
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" /> Descending
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {hasActiveFilters() && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-center text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            {showBooksLoading ? (
              <ShimmerLoading count={12} />
            ) : (
              <>
                {books && books.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {books.map((book) => (
                        <BookCard
                          key={book.id}
                          id={book.id}
                          title={book.title}
                          author={book.author}
                          price={book.price}
                          rating={book.rating}
                          image={`${buildStorageUrl(book.cover_img)}`}
                        />
                      ))}
                    </div>

                    <div className="mt-10 text-center">
                      {loading && books && (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span>Loading more...</span>
                          </div>
                        </div>
                      )}

                      {!loading && hasNextPage && (
                        <button
                          onClick={() => loadMore()}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-poppins font-medium shadow-md hover:shadow-lg"
                        >
                          Load More ({pagination.currentPage} /{" "}
                          {pagination.lastPage})
                        </button>
                      )}

                      {!hasNextPage && books && (
                        <div className="py-6">
                          <p className="text-gray-500">
                            You've reached the end of {totalItems} books
                          </p>
                        </div>
                      )}

                      {books && (
                        <div className="mt-4 text-sm text-gray-400">
                          Showing{" "}
                          {(pagination.currentPage - 1) * pagination.perPage +
                            1}{" "}
                          -{" "}
                          {Math.min(
                            pagination.currentPage * pagination.perPage,
                            totalItems
                          )}{" "}
                          of {totalItems} books
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                      <Filter className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No books found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your filters
                    </p>
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}
