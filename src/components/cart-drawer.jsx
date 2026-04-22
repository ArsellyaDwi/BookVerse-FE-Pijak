import { useCart } from "@/context/cart-context";
import { ImageWithFallback } from "@/components/image-with-fallback";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } =
    useCart();

  const handleCheckout = () => {
    onClose();
    window.location.href = "/checkout";
  };

  const handleViewCart = () => {
    onClose();
    window.location.href = "/cart";
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
                Shopping Cart
              </h2>
              <p className="text-slate-500 font-normal text-[13px] leading-relaxed">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
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

          {/* SCROLLABLE CONTENT - padding 24px */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              // Empty State
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  {/* Shopping Cart SVG */}
                  <svg
                    className="w-10 h-10 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </div>
                <p className="font-poppins text-[15px] font-normal text-slate-500 mb-6">
                  Your shopping cart is empty
                </p>
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-blue-600 text-white font-poppins text-sm font-medium rounded-xl shadow-md transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              // List Items - spacing 16px
              <div className="flex flex-col gap-4">
                {cartItems.map((item) => (
                  <div
                    key={item.book.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-gray-50 transition-all hover:border-blue-600 hover:shadow-md"
                  >
                    <div className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-[72px] h-24 overflow-hidden bg-gray-100 rounded-lg flex-shrink-0">
                        <ImageWithFallback
                          src={item.book.image}
                          alt={item.book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-poppins font-semibold text-sm leading-relaxed text-gray-800 line-clamp-2 mb-1">
                            {item.book.title}
                          </h3>
                          <p className="font-poppins text-sm font-semibold text-blue-600 mb-3">
                            Rp {item.book.price.toLocaleString("id-ID")}
                          </p>
                        </div>

                        {/* Quantity Selector & Delete Button */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Selector - Minimalist */}
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.book.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-l-lg"
                            >
                              {/* Minus SVG */}
                              <svg
                                className="w-4 h-4 text-slate-500"
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
                            <span className="w-10 text-center font-poppins text-sm font-medium text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.book.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors rounded-r-lg"
                            >
                              {/* Plus SVG */}
                              <svg
                                className="w-4 h-4 text-slate-500"
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

                          {/* Delete Button */}
                          <button
                            onClick={() => removeFromCart(item.book.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove from cart"
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

          {/* STICKY FOOTER - with Total Price */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-100 p-6 bg-white">
              {/* Total Price Display */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-poppins font-medium text-sm text-slate-500">
                  Total
                </span>
                <span className="font-poppins text-xl font-bold text-blue-600">
                  Rp {getTotalPrice().toLocaleString("id-ID")}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full h-12 bg-blue-600 text-white font-poppins text-sm font-semibold rounded-xl shadow-md transition-all duration-300 mb-3 flex items-center justify-center hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Checkout
              </button>

              {/* View Cart Button */}
              <button
                onClick={handleViewCart}
                className="block w-full h-12 flex items-center justify-center border-2 border-blue-600 text-blue-600 font-poppins text-sm font-medium rounded-xl transition-all duration-300 hover:bg-blue-50"
              >
                View Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
