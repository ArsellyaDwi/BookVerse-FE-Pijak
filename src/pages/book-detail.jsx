import { useParams, Link } from "react-router";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { booksData } from "@/data/booksData";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function BookDetail() {
  const { id } = useParams();
  const book = booksData.find((b) => b.id === Number(id));
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!book) {
    return (
      <div className="max-w-[1440px] mx-auto py-16 px-10 text-center">
        <h2 className="font-poppins text-[28px] font-bold text-gray-800 mb-4 leading-relaxed">
          Book Not Found
        </h2>
        <Link
          to="/"
          className="font-poppins text-sm text-blue-600 no-underline leading-relaxed hover:underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(book.id);

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book.id);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(book);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      {/* Container with 40px padding */}
      <div className="max-w-[1440px] mx-auto py-16 px-10">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-poppins text-sm font-medium text-slate-500 no-underline mb-10 transition-opacity hover:opacity-70"
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

        {/* Main Content: 2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-16 items-start">
          {/* LEFT COLUMN: Single Main Image Only */}
          <div>
            {/* Main Image - HD & Clean */}
            <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-50 shadow-md">
              <ImageWithFallback
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Book Information */}
          <div className="flex flex-col justify-between h-auto min-h-full">
            {/* TOP SECTION: Category, Title, Author, Rating, Price, Details */}
            <div>
              {/* Category Badge - Bordered Capsule Tag */}
              <div className="inline-block px-3.5 py-1.5 bg-transparent text-blue-600 border border-gray-300 rounded-full font-poppins text-sm font-medium mb-2 leading-relaxed">
                {book.category}
              </div>

              {/* Book Title */}
              <h1 className="font-poppins text-[32px] font-bold text-gray-800 mb-2 leading-tight">
                {book.title}
              </h1>

              {/* Author */}
              <p className="font-poppins text-base font-normal text-gray-500 mb-4 leading-relaxed">
                by {book.author}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(book.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 fill-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="font-poppins text-sm text-gray-500 leading-relaxed">
                  {book.rating} ({book.reviews.length} reviews)
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-300 my-4" />

              {/* Price */}
              <div className="mb-4">
                <span className="font-poppins text-2xl font-semibold text-blue-600 leading-relaxed">
                  Rp {book.price.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-300 my-4" />

              {/* Book Specifications */}
              <div className="mb-4">
                <h3 className="font-poppins text-base font-semibold text-gray-800 mb-3 leading-relaxed">
                  Book Details
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="font-poppins text-sm text-gray-500 leading-relaxed">
                      Author
                    </span>
                    <span className="font-poppins text-sm font-medium text-gray-800 leading-relaxed">
                      {book.author}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-poppins text-sm text-gray-500 leading-relaxed">
                      Publication Year
                    </span>
                    <span className="font-poppins text-sm font-medium text-gray-800 leading-relaxed">
                      2024
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-poppins text-sm text-gray-500 leading-relaxed">
                      ISBN
                    </span>
                    <span className="font-poppins text-sm font-medium text-gray-800 leading-relaxed">
                      978-602-1234-56-7
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-poppins text-sm text-gray-500 leading-relaxed">
                      Pages
                    </span>
                    <span className="font-poppins text-sm font-medium text-gray-800 leading-relaxed">
                      304 pages
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: Quantity & Action Buttons */}
            <div>
              {/* Divider */}
              <div className="h-px bg-gray-300 my-4" />

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="font-poppins text-sm font-medium text-gray-800 block mb-2 leading-relaxed">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-center transition-all duration-300 shadow-sm hover:bg-gray-50"
                  >
                    {/* Minus SVG */}
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-16 h-10 border border-gray-300 rounded-lg text-center font-poppins text-sm font-medium text-gray-800 shadow-sm"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-center transition-all duration-300 shadow-sm hover:bg-gray-50"
                  >
                    {/* Plus SVG */}
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-2">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 px-6 bg-blue-600 text-white border-none rounded-full font-poppins text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 leading-relaxed shadow-md hover:bg-blue-700"
                >
                  {/* Shopping Cart SVG */}
                  <svg
                    className="w-[18px] h-[18px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 17v4"
                    />
                  </svg>
                  Add to Cart
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`w-11 h-11 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 shadow-sm ${
                    inWishlist
                      ? "bg-red-500 border border-red-500 shadow-md"
                      : "bg-transparent border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {/* Heart SVG */}
                  <svg
                    className={`w-[18px] h-[18px] ${
                      inWishlist ? "text-white fill-white" : "text-gray-500"
                    }`}
                    fill={inWishlist ? "white" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Buy Now Button */}
              <Link
                to="/checkout"
                className="flex w-full py-2.5 px-6 bg-gray-800 text-white border-none rounded-full font-poppins text-sm font-semibold no-underline items-center justify-center transition-all duration-300 leading-relaxed shadow-md hover:bg-gray-900"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-gray-300 my-16" />

        {/* Description Section */}
        <div className="mb-16">
          <h2 className="font-poppins text-[28px] font-bold text-gray-800 mb-6 leading-relaxed">
            Book Description
          </h2>
          <p className="font-poppins text-sm font-normal text-gray-600 leading-relaxed text-justify">
            {book.description}
          </p>
        </div>

        {/* Reviews Section */}
        {book.reviews.length > 0 && (
          <>
            {/* Horizontal Divider */}
            <div className="h-px bg-gray-300 my-16 mb-8" />

            <div>
              <h2 className="font-poppins text-[28px] font-bold text-gray-800 mb-8 leading-relaxed">
                Reader Reviews
              </h2>
              <div className="flex flex-col gap-4">
                {book.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 bg-white border border-gray-200 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-poppins text-base font-semibold text-gray-800 mb-1 leading-relaxed">
                          {review.userName}
                        </h4>
                        <p className="font-poppins text-xs text-gray-400 leading-relaxed">
                          {review.date}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 fill-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="font-poppins text-sm text-gray-600 leading-relaxed text-justify">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
