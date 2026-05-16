import { useParams, Link } from "react-router";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import useQuery from "@/hooks/use-query";
import { buildStorageUrl } from "@/lib/helper";
import { Truck, AlertCircle, ShoppingBag, Heart, CreditCard, ChevronRight } from "lucide-react";
import BookCard from "@/components/book-card";

export default function BookDetail() {
  const { id } = useParams();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: bookResponse, loading: bookLoading } = useQuery({
    url: `books/${id}`,
  });

  // Fetch content-based recommendations
  const { data: recommendationsResponse, loading: recommendationsLoading } = useQuery({
    url: `content-based?book_id=${id}`,
  });

  const book = bookResponse;
  const recommendations = recommendationsResponse || [];

  if (bookLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-[1200px] mx-auto py-8 px-4">
          <div className="animate-pulse flex gap-8">
            <div className="bg-gray-200 rounded-xl w-56 h-80" />
            <div className="flex-1 space-y-4">
              <div className="h-5 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-5 bg-gray-200 rounded w-1/2" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-[1200px] mx-auto py-20 px-4 text-center">
          <h2 className="font-poppins text-2xl font-bold text-gray-800 mb-4">
            Book Not Found
          </h2>
          <Link to="/" className="text-blue-600 hover:underline font-poppins">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(book.id);

  const handleWishlistToggle = () => {
    console.log("Wishlist clicked, book.id:", book.id);
    if (inWishlist) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book.id);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(book.id);
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const getGenreSlug = (genreName) => {
    return genreName.toLowerCase().replace(/\s+/g, '-');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID").format(Math.floor(price));
  };

  const originalPrice = parseFloat(book.price);
  const discountedPrice = originalPrice * 0.9;
  const hasDiscount = true;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="max-w-[1200px] mx-auto py-6 px-4">

        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm font-poppins text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors duration-300 hover:underline underline-offset-4">
              Home
            </Link>
            <span>›</span>
            <Link to="/books" className="hover:text-blue-600 transition-colors duration-300 hover:underline underline-offset-4">
              Books
            </Link>
            <span>›</span>
            {book.genres && book.genres.length > 0 && (
              <>
                <Link
                  to={`/genres/${book.genres[0].slug || getGenreSlug(book.genres[0].name)}`}
                  className="hover:text-blue-600 transition-colors duration-300 hover:underline underline-offset-4"
                >
                  {book.genres[0].name}
                </Link>
                <span>›</span>
              </>
            )}
            <span className="text-gray-800 font-medium truncate max-w-[200px]">{book.title}</span>
          </div>
        </div>

        {/* Main Content - 2 kolom */}
        <div className="flex gap-10 flex-col md:flex-row">

          {/* LEFT: Gambar */}
          <div className="flex-shrink-0">
            <div className="w-56 md:w-64">
              <img
                src={buildStorageUrl(book.cover_img || book.image)}
                alt={book.title}
                className="w-full h-auto object-cover rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* RIGHT: Book Info */}
          <div className="flex-1">
            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {book.genres && book.genres.length > 0 ? (
                book.genres.slice(0, 4).map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/genres/${genre.slug || getGenreSlug(genre.name)}`}
                    className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full font-poppins text-sm font-medium hover:bg-blue-500 hover:text-white transition-all"
                  >
                    {genre.name}
                  </Link>
                ))
              ) : (
                <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full font-poppins text-sm">
                  {book.category || "General"}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-poppins text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {book.title}
            </h1>

            {/* Author */}
            <p className="font-poppins text-base text-gray-500 mb-4">
              oleh <span className="text-gray-700 font-medium">{book.author}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(book.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="font-poppins text-sm text-gray-500">
                {book.rating} ({book.ratings?.toLocaleString() || book.reviews?.length || 0} ulasan)
              </span>
            </div>

            {/* Price */}
            <div className="mb-5">
              {hasDiscount ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl md:text-3xl font-poppins font-bold text-red-600">
                    Rp {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-sm md:text-base font-poppins text-gray-400 line-through">
                    Rp {formatPrice(originalPrice)}
                  </span>
                  <span className="text-xs md:text-sm font-poppins text-green-600 font-semibold">
                    Hemat Rp {formatPrice(originalPrice - discountedPrice)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl md:text-3xl font-poppins font-bold text-red-600">
                  Rp {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* Detail Buku */}
            <div className="mb-6">
              <h3 className="font-poppins text-base md:text-lg font-semibold text-gray-800 mb-3">
                Detail Buku
              </h3>
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex gap-4">
                  <span className="text-gray-500 w-28">Penulis</span>
                  <span className="text-gray-800">{book.author}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500 w-28">Penerbit</span>
                  <span className="text-gray-800">{book.publisher || "-"}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500 w-28">Tahun Terbit</span>
                  <span className="text-gray-800">{book.publish_date ? new Date(book.publish_date).getFullYear() : "-"}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500 w-28">ISBN</span>
                  <span className="text-gray-800">{book.isbn || "-"}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500 w-28">Halaman</span>
                  <span className="text-gray-800">{book.pages || "-"}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500 w-28">Bahasa</span>
                  <span className="text-gray-800">{book.language || "-"}</span>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-5 mb-6">
              <span className="font-poppins text-base text-gray-700">Jumlah</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all text-lg"
                >
                  -
                </button>
                <span className="w-14 text-center font-poppins text-base font-medium text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="w-9 h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Info Promo Section - 2 kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Pick up at Store */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-poppins text-sm font-semibold text-blue-800">
                      Pick up at Store, Free Shipping
                      <span className="font-poppins text-xs text-blue-600 mt-1">
                        Available at stores with special icon. Free shipping on minimum purchase Rp50,000
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Non-refundable */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-poppins text-sm font-semibold text-amber-800">
                      Non-refundable & Non-returnable
                    </p>
                    <p className="font-poppins text-xs text-amber-600 mt-1">
                      This item cannot be canceled, returned, or refunded once purchased
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION PANEL - DI KANAN SAJA */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <div className="w-80">
            {/* Baris 1: Status + Wishlist di kiri, pajak di kanan */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {book.stock === 0 ? (
                  <span className="px-3 py-1.5 bg-red-500 text-white text-sm font-poppins font-semibold rounded-lg">
                    Stok Habis
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-green-500 text-white text-sm font-poppins font-semibold rounded-lg">
                    Tersedia
                  </span>
                )}

                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg font-poppins font-medium text-sm transition-all border ${inWishlist
                    ? "bg-red-50 border-red-400 text-red-600"
                    : "bg-white border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500"
                    }`}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
              </div>

              <span className="text-[10px] text-gray-400 font-poppins">*termasuk pajak</span>
            </div>

            {/* Baris 2: Tombol Aksi - SAMPINGAN (kiri dan kanan) */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-poppins font-semibold text-base transition-all ${book.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                + Keranjang
              </button>

              <Link
                to={book.stock > 0 ? "/checkout" : "#"}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-poppins font-semibold text-base text-center transition-all ${book.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                  : "bg-gray-800 text-white hover:bg-gray-900"
                  }`}
              >
                <CreditCard className="w-5 h-5" />
                Beli Sekarang
              </Link>
            </div>
          </div>
        </div>

        {/* Synopsis Section */}
        <div className="mt-10 pt-4 border-t border-gray-200">
          <h2 className="font-poppins text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Sinopsis
          </h2>
          <p className="font-poppins text-sm md:text-base text-gray-600 leading-relaxed text-justify">
            {book.description}
          </p>
        </div>

        {/* Characters Section */}
        {book.characters && book.characters.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h2 className="font-poppins text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Tokoh Utama
            </h2>
            <div className="flex flex-wrap gap-3">
              {book.characters.slice(0, 8).map((character) => (
                <span
                  key={character.id}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-poppins text-sm font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {character.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {book.reviews && book.reviews.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h2 className="font-poppins text-xl md:text-2xl font-bold text-gray-800 mb-5">
              Ulasan Pembaca
            </h2>
            <div className="space-y-4">
              {book.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div>
                      <h4 className="font-poppins font-semibold text-base text-gray-800">
                        {review.userName}
                      </h4>
                      <p className="font-poppins text-xs text-gray-400 mt-1">
                        {review.date}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="font-poppins text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* You May Also Like Section - Content Based Recommendations */}
        {!recommendationsLoading && recommendations.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-poppins text-2xl font-bold text-gray-800">
                  You May Also Like
                </h2>
                <p className="font-poppins text-sm text-gray-500 mt-1">
                  Based on your interest in {book.title}
                </p>
              </div>
              <Link
                to={`/recommendations/${book.id}`}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-poppins text-sm font-medium transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recommendations.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author?.split(',')[0] || book.author}
                  price={book.price}
                  rating={book.rating || 0}
                  image={buildStorageUrl(book.cover_img)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading skeleton for recommendations */}
        {recommendationsLoading && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="mb-6">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-96" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-[2/3] mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}