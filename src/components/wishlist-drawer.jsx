import { useState } from "react";
import { useWishlist } from "@/context/wishlist-context";
import { booksData } from "@/data/booksData";
import { ImageWithFallback } from "@/components/image-with-fallback";

export default function WishlistDrawer({ isOpen, onClose }) {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const wishlistBooks = booksData.filter((book) =>
    wishlistItems.includes(book.id)
  );

  const handleViewBook = (bookId) => {
    onClose();
    window.location.href = `/book/${bookId}`;
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Right Drawer - WIDTH: 400px */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 transform transition-transform duration-300 font-poppins shadow-[-4px_0_24px_rgba(0,0,0,0.12)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "400px" }}
      >
        <div className="flex flex-col h-full">
          {/* HEADER - FIXED with padding 24px from each side */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-slate-800 font-bold text-xl leading-relaxed mb-1">
                Wishlist
              </h2>
              <p className="text-slate-500 font-normal text-[13px] leading-relaxed">
                {wishlistBooks.length}{" "}
                {wishlistBooks.length === 1 ? "book" : "books"} saved
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              {/* Close X SVG */}
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* SCROLLABLE CONTENT - padding 24px (3x8pt) */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlistBooks.length === 0 ? (
              // Empty State
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  {/* Heart SVG */}
                  <svg
                    className="w-10 h-10 text-gray-300"
                    fill="none"
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
                </div>
                <p className="font-poppins text-[15px] font-normal text-slate-500 mb-6">
                  Wishlist is empty
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      onClose();
                      window.location.href = "/";
                    }}
                    className="px-8 py-3 font-poppins text-sm font-semibold text-white bg-blue-600 rounded-full transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Explore Books
                  </button>
                </div>
              </div>
            ) : (
              // List Items - spacing 16px (2x8pt)
              <div className="flex flex-col gap-4">
                {wishlistBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-gray-50 transition-all hover:border-blue-600 hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      {/* Product Image - border-radius: 8px */}
                      <button
                        onClick={() => handleViewBook(book.id)}
                        className="flex-shrink-0"
                      >
                        <div className="w-[72px] h-24 overflow-hidden bg-gray-100 rounded-lg">
                          <ImageWithFallback
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </button>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <button
                            onClick={() => handleViewBook(book.id)}
                            className="text-left block w-full"
                          >
                            <h3 className="font-poppins font-semibold text-sm leading-relaxed text-gray-800 line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
                              {book.title}
                            </h3>
                          </button>
                          <p className="font-poppins text-xs font-normal text-slate-500 mb-2">
                            {book.author}
                          </p>
                        </div>

                        {/* Price & Delete Button */}
                        <div className="flex items-center justify-between">
                          <p className="font-poppins text-sm font-semibold text-blue-600">
                            Rp {book.price.toLocaleString("id-ID")}
                          </p>
                          <button
                            onClick={() => removeFromWishlist(book.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from wishlist"
                          >
                            {/* Trash SVG */}
                            <svg
                              className="w-4 h-4 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STICKY FOOTER - padding 24px */}
          {wishlistBooks.length > 0 && (
            <div className="border-t border-slate-100 p-6">
              <button
                onClick={onClose}
                className="block w-full h-12 flex items-center justify-center border-2 border-blue-600 text-blue-600 font-poppins text-sm font-medium rounded-xl transition-all duration-300 hover:bg-blue-50"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
