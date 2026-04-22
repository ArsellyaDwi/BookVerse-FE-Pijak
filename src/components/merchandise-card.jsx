import { Heart, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

export default function MerchandiseCard({
  id,
  name,
  price,
  image,
  category = "Merchandise",
}) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWishlist = isInWishlist(id);
  const waNumber = "6287822463210";

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
      title: name,
      author: "BookVerse",
      price,
      rating: 5,
      image,
      category,
      description: "Official BookVerse Merchandise",
      reviews: [],
    });
  };

  const handleCardClick = () => {
    // Redirect to WhatsApp when card is clicked
    const waMessage = `Hello%20BookVerse,%20I%20want%20to%20order%20this%20merchandise%20product:%0A%0AName:%20${encodeURIComponent(
      name
    )}%0APrice:%20Rp%20${price.toLocaleString("id-ID")}`;
    window.open(`https://wa.me/${waNumber}?text=${waMessage}`, "_blank");
  };

  return (
    <div className="group cursor-pointer" onClick={handleCardClick}>
      <div className="bg-white rounded-2xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
        {/* Image Container with Isolated Zoom Effect */}
        <div className="relative mb-6 overflow-hidden rounded-2xl">
          {/* Aspect Ratio Container - NO TRANSFORM */}
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
            {/* Image with Isolated Zoom - ONLY THIS SCALES */}
            <ImageWithFallback
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out origin-center hover:scale-110"
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

        {/* Product Info - STABLE TEXT (NO TRANSFORM) */}
        <div>
          {/* OFFICIAL Tag - STABLE */}
          <div className="inline-block mb-2 border border-slate-300 rounded-full px-3 py-1 font-poppins text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
            OFFICIAL
          </div>

          {/* Product Name - STABLE */}
          <h3 className="font-poppins text-base font-semibold leading-relaxed text-gray-800 mt-2 mb-2 line-clamp-2 min-h-[3rem] hover:text-blue-600 transition-colors duration-300">
            {name}
          </h3>

          {/* Price - STABLE */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <span className="font-poppins text-sm font-medium leading-relaxed text-blue-600">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
