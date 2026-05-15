import React, { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { buildStorageUrl } from "@/lib/helper";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router";

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cartItems,
    loading,
    addToCart,
    minusCart,
    removeByBookId,
    getTotalItems,
    getTotalPrice,
    addToCartLoading,
    minusCartLoading,
    removeByBookIdLoading,
    refetchCart,
  } = useCart();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleIncrement = async (bookId) => {
    await addToCart(bookId, 1);
  };

  const handleDecrement = async (bookId) => {
    await minusCart(bookId, 1);
  };

  const handleRemove = async (bookId) => {
    await removeByBookId(bookId);
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const drawerWidth = isMobile ? "100%" : "400px";

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:bg-black/50 z-100 transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer Container */}
      <div
        className={`fixed top-0 right-0 h-full bg-white z-101 transform transition-transform duration-300 ease-out shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{ width: drawerWidth, maxWidth: "100vw" }}
      >
        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-slate-800 font-bold text-lg sm:text-xl md:text-2xl leading-relaxed mb-0.5 sm:mb-1">
                Shopping Cart
              </h2>
              <p className="text-slate-500 font-normal text-xs sm:text-[13px] leading-relaxed">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 active:scale-95"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                </div>
                <p className="font-poppins text-sm sm:text-base font-normal text-slate-500 mb-6">
                  Your cart is empty
                </p>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/");
                  }}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 font-poppins text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 active:scale-95 transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:gap-4">
                {cartItems.map((item) => {
                  const book = item.book;
                  const itemPrice = parseFloat(book?.price) || 0;

                  return (
                    <div
                      key={item.id}
                      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-gray-50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex gap-3 sm:gap-4">

                        {/* Product Image */}
                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/books/${item.book_id}`);
                          }}
                          className="flex-shrink-0"
                        >
                          <div className="w-16 h-20 sm:w-[72px] sm:h-24 md:w-20 md:h-28 overflow-hidden bg-gray-100 rounded-lg hover:opacity-80 transition-opacity">
                            <ImageWithFallback
                              src={book?.cover_img ? buildStorageUrl(book.cover_img) : null}
                              alt={book?.title || "Book cover"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </button>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            {/* Title */}
                            <button
                              onClick={() => {
                                onClose();
                                navigate(`/books/${item.book_id}`);
                              }}
                              className="text-left block w-full"
                            >
                              <h3 className="font-poppins font-semibold text-sm sm:text-base text-gray-800 line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
                                {book?.title || "Unknown Title"}
                              </h3>
                            </button>
                            <p className="font-poppins text-xs text-slate-500 mb-2 line-clamp-1">
                              {book?.author || "Unknown Author"}
                            </p>
                          </div>

                          {/* Price & Quantity Controls */}
                          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mt-2">
                            {/* Price */}
                            <p className="font-poppins text-sm sm:text-base font-semibold text-blue-600">
                              Rp {!isNaN(itemPrice) ? itemPrice.toLocaleString("id-ID") : "0"}
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDecrement(item.book_id)}
                                disabled={minusCartLoading}
                                className="w-8 h-8 sm:w-7 sm:h-7 md:w-8 md:h-8 border border-gray-300 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 active:scale-95 transition-all"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="font-poppins text-sm font-medium text-gray-800 min-w-[24px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncrement(item.book_id)}
                                disabled={addToCartLoading}
                                className="w-8 h-8 sm:w-7 sm:h-7 md:w-8 md:h-8 border border-gray-300 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 active:scale-95 transition-all"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleRemove(item.id)}
                                disabled={removeByBookIdLoading}
                                className="p-1.5 hover:bg-red-50 rounded-lg disabled:opacity-50 active:scale-95 transition-all"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-100 p-4 sm:p-5 md:p-6 bg-white sticky bottom-0 z-10 shadow-lg">
              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-poppins text-sm sm:text-base font-medium text-gray-600">
                  Total
                </span>
                <span className="font-poppins text-xl sm:text-2xl font-bold text-blue-600">
                  Rp {!isNaN(getTotalPrice()) ? getTotalPrice().toLocaleString("id-ID") : "0"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="order-2 sm:order-1 py-2.5 px-4 border-2 border-gray-300 text-gray-700 font-poppins text-sm font-medium rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="order-1 sm:order-2 py-2.5 px-4 bg-blue-600 text-white font-poppins text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}