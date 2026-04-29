import { useState } from "react";
import { ArrowRight } from "lucide-react";
import BookCard from "./book-card";
import useQueryPagination from "@/hooks/use-query-pagination";
import { buildStorageUrl } from "@/lib/helper";


// Shimmer Loading Component
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
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
    {[...Array(count)].map((_, index) => (
      <ShimmerCard key={index} />
    ))}
  </div>
);

export default function BestSellersSection() {
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
      <section className="bg-white pt-8 pb-0">
        <div className="max-w-[1440px] mx-auto px-20">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <ShimmerLoading count={10} />
          <div className="h-px bg-gray-200 my-10 w-full" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pt-8 pb-0">
      <div className="max-w-[1440px] mx-auto px-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#333333] font-poppins text-[28px] font-bold">
            Bestselling Books
          </h2>

          <button
            onClick={() => (window.location.href = "/genre/all")}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-all font-poppins text-sm font-medium cursor-pointer"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
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
            <div className="col-span-5 text-center py-10 text-gray-500 font-poppins">
              No books found in database.
            </div>
          )}
        </div>

        {/* Load More Section */}
        <div className="mt-10 text-center">
          {/* Loading more indicator */}
          {loading && books && books.length > 0 && (
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading more books...</span>
              </div>
            </div>
          )}

          {/* Load More Button */}
          {!loading && hasNextPage && (
            <button
              onClick={() => loadMore()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-poppins font-medium shadow-md hover:shadow-lg"
            >
              Load More Books ({pagination.currentPage} / {pagination.lastPage})
            </button>
          )}

          {/* End message */}
          {!hasNextPage && books && books.length > 0 && (
            <div className="py-6">
              <p className="text-gray-500 font-poppins">
                ✨ You've seen all {totalItems} books! ✨
              </p>
            </div>
          )}

          {/* Pagination info */}
          {books && books.length > 0 && (
            <div className="mt-4 text-sm text-gray-400 font-poppins">
              Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} - {Math.min(pagination.currentPage * pagination.perPage, totalItems)} of {totalItems} books
            </div>
          )}
        </div>

        <div className="h-px bg-gray-200 my-10 w-full" />
      </div>
    </section>
  );
}