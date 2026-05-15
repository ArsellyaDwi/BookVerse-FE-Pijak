import { Heart, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { useNavigate } from "react-router";

export default function BookCard({
  id,
  title,
  author,
  price,
  rating,
  image,
  category = "",
  description = "",
}) {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(id);
  };

  const handleCardClick = () => {
    navigate(`/books/${id}`);
  };

  const formattedPrice = new Intl.NumberFormat("id-ID").format(price);

  const getStarSize = () => {
    return "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4";
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={handleCardClick}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Card Container */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">

        {/* Image Container */}
        <div className="relative mb-3 sm:mb-4 md:mb-5 lg:mb-6 overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl flex-shrink-0">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Floating Buttons */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex flex-col gap-1.5 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlistToggle}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-110 ${inWishlist ? "bg-red-500! hover:bg-red-600" : "hover:bg-gray-50"
                }`}
              title="Wishlist"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <Heart
                className={`w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 ${inWishlist ? "text-white fill-white" : "text-gray-700"
                  }`}
                strokeWidth={1.5}
              />
            </button>

            <button
              onClick={handleAddToCart}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-110 hover:bg-gray-50"
              title="Add to Cart"
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              <ShoppingCart
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-gray-700"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow">
          <div>
            {/* Title */}
            <h3 className="font-poppins font-semibold text-gray-800 mb-1 sm:mb-1.5 md:mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-300"
              style={{
                fontSize: 'clamp(0.875rem, 3vw, 1rem)',
                lineHeight: 'clamp(1.25rem, 4vw, 1.5rem)',
                minHeight: 'clamp(2.5rem, 8vw, 3rem)'
              }}>
              {title}
            </h3>

            {/* Author */}
            <p className="font-poppins text-gray-500 mb-1.5 sm:mb-2 line-clamp-1"
              style={{ fontSize: 'clamp(0.688rem, 2.5vw, 0.75rem)' }}>
              {author}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-2.5 md:mb-3">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`${getStarSize()} ${i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                    }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
              <span className="font-poppins text-gray-500 ml-0.5 sm:ml-1"
                style={{ fontSize: 'clamp(0.688rem, 2.5vw, 0.75rem)' }}>
                ({rating})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="pt-2 sm:pt-3 md:pt-4 mt-auto border-t border-slate-100">
            <span className="font-poppins font-medium text-blue-600"
              style={{ fontSize: 'clamp(0.813rem, 3vw, 0.875rem)' }}>
              Rp {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}