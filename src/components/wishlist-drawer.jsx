import { useWishlist } from "@/context/wishlist-context";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { buildStorageUrl } from "@/lib/helper";

export default function WishlistDrawer({ isOpen, onClose }) {
  const { 
    wishlistItems, 
    loading, 
    removeFromWishlist, 
    removeFromWishlistLoading,
    refetchWishlist 
  } = useWishlist();

  const handleViewBook = (bookId) => {
    onClose();
    window.location.href = `/books/${bookId}`;
  };

  const handleRemoveFromWishlist = async (itemId) => {
    await removeFromWishlist(itemId);
    refetchWishlist(); // Refresh to ensure sync with server
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
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-slate-800 font-bold text-xl leading-relaxed mb-1">
                Wishlist
              </h2>
              <p className="text-slate-500 font-normal text-[13px] leading-relaxed">
                {loading ? "Loading..." : `${wishlistItems.length} ${wishlistItems.length === 1 ? "book" : "books"} saved`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
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

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              // Loading State
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-gray-50 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-[72px] h-24 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : wishlistItems.length === 0 ? (
              // Empty State
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
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
              // List Items
              <div className="flex flex-col gap-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-gray-50 transition-all hover:border-blue-600 hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <button
                        onClick={() => handleViewBook(item.book_id)}
                        className="flex-shrink-0"
                      >
                        <div className="w-[72px] h-24 overflow-hidden bg-gray-100 rounded-lg">
                          <ImageWithFallback
                            src={buildStorageUrl(item.book?.cover_img)}
                            alt={item.book?.title || "Book cover"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </button>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <button
                            onClick={() => handleViewBook(item.book_id)}
                            className="text-left block w-full"
                          >
                            <h3 className="font-poppins font-semibold text-sm leading-relaxed text-gray-800 line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
                              {item.book?.title || "Unknown Title"}
                            </h3>
                          </button>
                          <p className="font-poppins text-xs font-normal text-slate-500 mb-2">
                            {item.book?.author || "Unknown Author"}
                          </p>
                        </div>

                        {/* Price & Delete Button */}
                        <div className="flex items-center justify-between">
                          <p className="font-poppins text-sm font-semibold text-blue-600">
                            Rp {item.book?.price ? parseFloat(item.book.price).toLocaleString("id-ID") : "0"}
                          </p>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            disabled={removeFromWishlistLoading}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove from wishlist"
                          >
                            {removeFromWishlistLoading ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
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
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STICKY FOOTER */}
          {wishlistItems.length > 0 && !loading && (
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