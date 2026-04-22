import { Link } from "react-router";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );
  const shipping = 15000;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-[1440px] mx-auto px-20 pt-32 pb-32 text-center">
          {/* Empty Cart SVG */}
          <svg
            className="w-24 h-24 mx-auto mb-8 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <h2 className="font-poppins text-3xl font-bold text-gray-800 mb-4">
            Cart is Empty
          </h2>
          <p className="font-poppins text-base text-gray-500 mb-8">
            There are no books in your shopping cart yet
          </p>
          <div className="flex justify-center">
            <Link
              to="/"
              className="inline-block px-8 py-3 font-poppins text-sm font-semibold text-white bg-blue-600 rounded-full transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-20 pt-16 pb-20">
        <h1 className="font-poppins text-4xl font-bold text-gray-800 mb-16">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.book.id}
                className="bg-white rounded-2xl p-6 shadow-sm flex gap-6"
              >
                {/* Book Cover */}
                <Link to={`/book/${item.book.id}`} className="flex-shrink-0">
                  <div className="w-32 h-40 rounded-xl overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={item.book.image}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Book Info */}
                <div className="flex-1">
                  <Link to={`/book/${item.book.id}`}>
                    <h3 className="font-poppins text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                      {item.book.title}
                    </h3>
                  </Link>
                  <p className="font-poppins text-sm text-gray-500 mb-4">
                    {item.book.author}
                  </p>
                  <p className="font-poppins text-2xl font-semibold text-blue-600">
                    Rp {item.book.price.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col justify-between items-end">
                  <button
                    onClick={() => removeItem(item.book.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    {/* Trash SVG */}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-2">
                    <button
                      onClick={() => updateQuantity(item.book.id, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    >
                      {/* Minus SVG */}
                      <svg
                        className="w-4 h-4"
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
                    <span className="w-8 text-center font-poppins text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.book.id, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    >
                      {/* Plus SVG */}
                      <svg
                        className="w-4 h-4"
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
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-24">
              <h3 className="font-poppins text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between font-poppins text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between font-poppins text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>Rp {shipping.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="flex justify-between font-poppins text-xl mb-8">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-blue-600">
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>

              <Link
                to="/checkout"
                className="block w-full py-3 px-4 font-poppins text-sm font-semibold text-white bg-blue-600 rounded-full text-center transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md"
              >
                Checkout
              </Link>

              <Link
                to="/"
                className="block w-full py-3 px-4 mt-4 font-poppins text-sm font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-full text-center transition-all duration-300 hover:bg-blue-50 hover:-translate-y-0.5"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
