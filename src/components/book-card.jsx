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
    addToCart({
      id,
      title,
      author,
      price,
      rating,
      image,
      category,
      description,
      reviews: [],
    });
  };

  const handleCardClick = () => {
    navigate(`/books/${id}`);
  };

  // Format price in IDR (Indonesian Rupiah)
  const formattedPrice = new Intl.NumberFormat("id-ID").format(price);

  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      <div className="bg-white rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-lg">
        {/* Image Container with Floating Buttons */}
        <div className="relative mb-6 overflow-hidden rounded-2xl">
          <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
            <ImageWithFallback
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Floating Buttons - Bottom Right Vertical */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlistToggle}
              className={`w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                inWishlist ? "bg-red-500 hover:bg-red-600" : "hover:bg-gray-50"
              }`}
              title="Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  inWishlist ? "text-white fill-white" : "text-gray-700"
                }`}
                strokeWidth={1.5}
              />
            </button>

            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-gray-50"
              title="Add to Cart"
            >
              <ShoppingCart
                className="w-5 h-5 text-gray-700"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h3 className="font-poppins text-base font-semibold leading-relaxed text-gray-800 mt-4 mb-2 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>

          <p className="font-poppins text-xs font-normal leading-relaxed text-gray-500 mb-2">
            {author}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
            <span className="font-poppins text-xs font-normal text-gray-500 ml-1">
              ({rating})
            </span>
          </div>

          {/* Price */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <span className="font-poppins text-sm font-medium leading-relaxed text-blue-600">
              Rp {formattedPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
