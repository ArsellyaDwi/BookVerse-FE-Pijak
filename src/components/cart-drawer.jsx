import React, { useEffect } from 'react';
import { useCart } from "@/context/cart-context";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { buildStorageUrl } from "@/lib/helper";
import { Minus, Plus, Trash2, X } from "lucide-react";

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
    refetchCart
  } = useCart();

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
    window.location.href = "/checkout";
  };

  if (loading) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />}
        <div className="fixed top-0 right-0 h-full bg-white z-50 transform transition-transform duration-300 w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Shopping Cart</h2>
              <button onClick={onClose} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading cart...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

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
                Shopping Cart
              </h2>
              <p className="text-slate-500 font-normal text-[13px] leading-relaxed">
                {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 17v4" />
                  </svg>
                </div>
                <p className="font-poppins text-[15px] font-normal text-slate-500 mb-6">
                  Your cart is empty
                </p>
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = "/";
                  }}
                  className="px-8 py-3 font-poppins text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => {
                  const book = item.book;
                  const itemPrice = parseFloat(book?.price) || 0;
                  const itemTotal = itemPrice * (item.quantity || 0);
                  
                  return (
                    <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-gray-50">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <button
                          onClick={() => {
                            onClose();
                            window.location.href = `/books/${item.book_id}`;
                          }}
                          className="flex-shrink-0"
                        >
                          <div className="w-[72px] h-24 overflow-hidden bg-gray-100 rounded-lg">
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
                            <button
                              onClick={() => {
                                onClose();
                                window.location.href = `/books/${item.book_id}`;
                              }}
                              className="text-left block w-full"
                            >
                              <h3 className="font-poppins font-semibold text-sm text-gray-800 line-clamp-2 mb-1 hover:text-blue-600">
                                {book?.title || "Unknown Title"}
                              </h3>
                            </button>
                            <p className="font-poppins text-xs text-slate-500 mb-2">
                              {book?.author || "Unknown Author"}
                            </p>
                          </div>

                          {/* Price & Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <p className="font-poppins text-sm font-semibold text-blue-600">
                              Rp {!isNaN(itemPrice) ? itemPrice.toLocaleString("id-ID") : "0"}
                            </p>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDecrement(item.book_id)}
                                disabled={minusCartLoading}
                                className="w-7 h-7 border border-gray-300 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                              >
                                <Minus className="w-3 h-3 text-gray-600" />
                              </button>
                              <span className="font-poppins text-sm font-medium text-gray-800 min-w-[20px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleIncrement(item.book_id)}
                                disabled={addToCartLoading}
                                className="w-7 h-7 border border-gray-300 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                              >
                                <Plus className="w-3 h-3 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleRemove(item.book_id)}
                                disabled={removeByBookIdLoading}
                                className="p-1 hover:bg-red-50 rounded-lg disabled:opacity-50"
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
            <div className="border-t border-slate-100 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-poppins text-sm font-medium text-gray-600">Total</span>
                <span className="font-poppins text-xl font-bold text-blue-600">
                  Rp {!isNaN(getTotalPrice()) ? getTotalPrice().toLocaleString("id-ID") : "0"}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 border-2 border-gray-300 text-gray-700 font-poppins text-sm font-medium rounded-xl hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-poppins text-sm font-semibold rounded-xl hover:bg-blue-700"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};