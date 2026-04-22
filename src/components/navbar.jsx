import { Link } from "react-router";
import {
  Heart,
  ShoppingCart,
  Search,
  ChevronDown,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import LoginDropdown from "./login-dropdown";
import WishlistDrawer from "./wishlist-drawer";
import CartDrawer from "./cart-drawer";
import logoImage from "@/assets/logo.png";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/auth-context";

export default function Navbar() {
  const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlistItems } = useWishlist();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  const handleWishlistClick = () => {
    setIsWishlistOpen(true);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 bg-white z-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Main Navbar */}
        <div className="w-full max-w-[1440px] mx-auto px-[40px] py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo - Left Side - PROMINENT & CLEAR */}
            <button
              onClick={handleLogoClick}
              className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity bg-none border-none p-0"
            >
              <img
                src={logoImage}
                alt="BookVerse Logo"
                className="h-12 w-auto block"
              />
            </button>

            {/* Center: Navigation Menu + Search Bar */}
            <div className="flex items-center flex-1 gap-8">
              {/* Navigation Menu */}
              <nav className="flex items-center gap-8">
                {/* Home */}
                <Link
                  to="/"
                  className="hover:text-[#2563EB] transition-colors font-poppins text-sm font-medium text-[#333333] no-underline"
                >
                  Home
                </Link>

                {/* All Genres - Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsGenresDropdownOpen(!isGenresDropdownOpen)
                    }
                    className="flex items-center gap-1 hover:text-[#2563EB] transition-colors font-poppins text-sm font-medium text-[#333333] bg-none border-none cursor-pointer"
                  >
                    <span>All Genres</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isGenresDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Genres Dropdown Menu */}
                  {isGenresDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsGenresDropdownOpen(false)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl overflow-hidden z-20 border border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                        <Link
                          to="/genre/books"
                          className="block hover:bg-blue-50 transition-colors font-poppins text-sm font-normal text-[#475569] py-3 px-5 no-underline"
                          onClick={() => setIsGenresDropdownOpen(false)}
                        >
                          Books
                        </Link>
                        <Link
                          to="/genre/merchandise"
                          className="block hover:bg-blue-50 transition-colors font-poppins text-sm font-normal text-[#475569] py-3 px-5 no-underline"
                          onClick={() => setIsGenresDropdownOpen(false)}
                        >
                          Merchandise
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </nav>

              {/* Search Bar - Clean & Simple */}
              <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                <div className="flex items-center h-11 border border-[#D1D5DB] rounded-full search-bar-container">
                  {/* Search Input */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for books or merchandise..."
                    className="flex-1 h-11 bg-transparent focus:outline-none font-poppins text-sm text-[#1E293B] pl-5 pr-2"
                  />

                  {/* Search Icon Button */}
                  <button
                    type="submit"
                    className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-blue-50 transition-colors mr-[2px]"
                  >
                    <Search className="w-5 h-5 text-[#475569]" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Actions - Icons */}
            <div className="flex items-center gap-4">
              {/* Contact Icon */}
              <button
                className="p-2 hover:bg-gray-50 rounded-lg transition-all duration-300"
                title="Contact Us"
                onClick={() =>
                  alert("Contact us: contact@bookverse.com or (021) 1234-5678")
                }
              >
                <Phone className="w-5 h-5 text-[#64748B]" strokeWidth={1.5} />
              </button>

              {/* Wishlist Icon */}
              <button
                onClick={handleWishlistClick}
                className="relative p-2 hover:bg-gray-50 rounded-lg transition-all duration-300"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 text-[#64748B]" strokeWidth={1.5} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white flex items-center justify-center rounded-full font-poppins text-[11px] font-semibold w-[18px] h-[18px] shadow-[0_2px_8px_rgba(239,68,68,0.3)]">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative p-2 hover:bg-gray-50 rounded-lg transition-all duration-300"
                title="Cart"
              >
                <ShoppingCart
                  className="w-5 h-5 text-[#64748B]"
                  strokeWidth={1.5}
                />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white flex items-center justify-center rounded-full font-poppins text-[11px] font-semibold w-[18px] h-[18px] shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Login Icon Button with Dropdown */}
              <div className="relative flex items-center">
                {isAuthenticated ? (
                  <div>Sudah Login</div>
                ) : (
                  <button
                    onClick={() => setIsLoginOpen(!isLoginOpen)}
                    className="p-2 hover:bg-gray-50 rounded-lg transition-all duration-300"
                    title="Login"
                  >
                    <User
                      className="w-5 h-5 text-[#64748B]"
                      strokeWidth={1.5}
                    />
                  </button>
                )}

                <LoginDropdown
                  isOpen={isLoginOpen}
                  onClose={() => setIsLoginOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-[#D1D5DB] w-full" />
      </header>

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
