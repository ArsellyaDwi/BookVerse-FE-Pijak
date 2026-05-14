import { useState } from "react";
import { ArrowRight } from "lucide-react";
import BookCard from "./book-card";
import useQueryPagination from "@/hooks/use-query-pagination";
import { buildStorageUrl } from "@/lib/helper";
import { useNavigate } from "react-router";

const ShimmerCard = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg aspect-[2/3] w-full"></div>
    <div className="mt-3 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

const ShimmerLoading = ({ count = 10 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
    {[...Array(count)].map((_, index) => (
      <ShimmerCard key={index} />
    ))}
  </div>
);

export default function BestSellersSection() {
  const navigate = useNavigate();
  const {
    data: books,
    loading,
    pagination,
    loadMore,
    hasNextPage,
    totalItems,
  } = useQueryPagination({
    url: "books",
    method: "GET",
    params: {
      per_page: 10,
    },
    paginated: true,
    immediate: true,
    onSuccess: (data, paginationInfo) => {
      console.log(`Loaded page ${paginationInfo?.currentPage} of ${paginationInfo?.lastPage}`);
    },
  });

  // Initial loading state
  if (loading && !books) {
    return (
      <section className="bg-white py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="h-7 md:h-8 bg-gray-200 rounded w-32 md:w-48 animate-pulse"></div>
            <div className="h-4 md:h-5 bg-gray-200 rounded w-16 md:w-20 animate-pulse"></div>
          </div>
          <ShimmerLoading count={10} />
          <div className="h-px bg-gray-200 my-8 md:my-10 w-full" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-[28px] font-bold text-gray-800 font-poppins text-center sm:text-left">
            Books
          </h2>

          <button
            onClick={() => navigate("/books")}
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all duration-300 font-poppins text-sm md:text-base font-medium cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {books && books.length > 0 ? (
            books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                price={book.price}
                rating={book.rating}
                image={`${buildStorageUrl(book.cover_img)}`}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 md:py-16 text-gray-500 font-poppins">
              <p className="text-base md:text-lg">No books found in database.</p>
            </div>
          )}
        </div>

        {/* Load More Section */}
        <div className="mt-8 md:mt-12 text-center">
          {/* Loading more indicator */}
          {loading && books && books.length > 0 && (
            <div className="mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm md:text-base">Loading more books...</span>
              </div>
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasNextPage && (
            <button
              onClick={() => loadMore()}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-poppins font-medium text-sm md:text-base shadow-md hover:shadow-lg active:scale-95"
            >
              Load More Books ({pagination.currentPage} / {pagination.lastPage})
            </button>
          )}

          {/* End message */}
          {!hasNextPage && books && books.length > 0 && (
            <div className="py-4 md:py-6">
              <p className="text-gray-500 font-poppins text-sm md:text-base">
                ✨ You've seen all {totalItems} books! ✨
              </p>
            </div>
          )}

          {/* Pagination info */}
          {books && books.length > 0 && (
            <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-400 font-poppins">
              Showing{" "}
              {(pagination.currentPage - 1) * pagination.perPage + 1} -{" "}
              {Math.min(pagination.currentPage * pagination.perPage, totalItems)}{" "}
              of {totalItems} books
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8 md:my-10 w-full" />
      </div>
    </section>
  );
}