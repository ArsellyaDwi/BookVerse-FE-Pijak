import { useParams, Link } from "react-router";
import BookCard from "@/components/book-card";
import { booksData } from "@/data/booksData";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function GenresPage() {
  const { genre } = useParams();

  const genreName = genre
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Filter books by genre if not 'all'
  const filteredBooks =
    genre === "all"
      ? booksData
      : booksData.filter(
          (book) => book.category.toLowerCase() === genreName?.toLowerCase()
        );

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-[1440px] mx-auto px-20 pt-16 pb-20">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-12 transition-colors font-poppins"
        >
          {/* Back Arrow SVG */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>

        {/* Page Header */}
        <div className="mb-16">
          <h1 className="font-poppins text-4xl font-bold text-gray-800 mb-4">
            {genre === "all" ? "All Books" : genreName}
          </h1>
          <p className="font-poppins text-lg text-gray-500">
            {filteredBooks.length}{" "}
            {filteredBooks.length === 1 ? "book" : "books"} found
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="font-poppins text-lg text-gray-500 mb-8">
              No books found in this genre
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-3 font-poppins text-sm font-semibold text-white bg-blue-600 rounded-full transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md"
            >
              Explore Other Genres
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
