import { Link, useNavigate } from "react-router";
import {
  Heart,
  ShoppingCart,
  Search,
  ChevronDown,
  Phone,
  User,
  X,
  BookOpen,
  Package,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import LoginDropdown from "./login-dropdown";
import UserMenuDropdown from "./user-menu-dropdown";
import WishlistDrawer from "./wishlist-drawer";
import CartDrawer from "./cart-drawer";
import logoImage from "@/assets/logo.png";
import { useAuth } from "@/context/auth-context";
import useQuery from "@/hooks/use-query";

export default function Navbar() {
  const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlistItems } = useWishlist();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  const {
    execute: fetchGenres,
    loading: genresLoading,
    data: genres,
  } = useQuery({
    url: "genre",
    method: "GET",
    guard: false,
    immediate: false,
  });

  useEffect(() => {
    if (isGenresDropdownOpen) {
      fetchGenres();
    }
  }, [isGenresDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGenresDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isGenresDropdownOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isGenresDropdownOpen, isUserMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsGenresDropdownOpen(false);
      navigate(`/books?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleWishlistClick = () => {
    setIsWishlistOpen(true);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleGenreClick = (id, genreSlug, genreName) => {
    setIsGenresDropdownOpen(false);
    navigate(`/books?genres=${id}&name=${encodeURIComponent(genreName)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearch(e);
    }
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const handleMenuClick = (path) => {
    setIsUserMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 bg-white z-99 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-[1440px] mx-auto px-[40px] py-4">
          <div className="flex items-center justify-between gap-8">
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

            <div className="flex items-center flex-1 gap-8">
              <nav className="flex items-center gap-8">
                <Link
                  to="/"
                  className="hover:text-[#2563EB] transition-colors font-poppins text-sm font-medium text-[#333333] no-underline"
                >
                  Home
                </Link>

                <div className="relative" ref={dropdownRef}>
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

                  {isGenresDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={() => setIsGenresDropdownOpen(false)}
                        style={{
                          animation: "fadeIn 0.2s ease-in-out",
                        }}
                      />

                      <div
                        className="fixed top-0 left-0 right-0 bottom-0 z-50"
                        style={{
                          animation: "slideIn 0.3s ease-out",
                        }}
                      >
                        <div className="w-full h-full bg-linear-to-br from-gray-50 to-white overflow-y-auto">
                          <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-8 py-5 flex items-center justify-between z-40">
                            <div>
                              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent font-poppins">
                                All Genres
                              </h2>
                              <p className="text-sm text-gray-500 mt-1 font-poppins">
                                Discover books by category
                              </p>
                            </div>
                            <button
                              onClick={() => setIsGenresDropdownOpen(false)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                            >
                              <X className="w-6 h-6 text-gray-600" />
                            </button>
                          </div>

                          <div className="px-8 py-12 max-w-7xl mx-auto">
                            {genresLoading ? (
                              <div className="flex justify-center items-center h-96">
                                <div className="relative">
                                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-600 animate-pulse" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                {genres?.map((genre) => (
                                  <button
                                    key={genre.id}
                                    onClick={() =>
                                      handleGenreClick(
                                        genre.id,
                                        genre.slug,
                                        genre.name
                                      )
                                    }
                                    className="group relative bg-white rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100 hover:border-blue-200 overflow-hidden"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    <div className="relative z-10">
                                      {genre.image ? (
                                        <div className="mb-4 flex justify-center">
                                          <img
                                            src={genre.image}
                                            alt={genre.name}
                                            className="w-20 h-20 object-contain rounded-xl group-hover:scale-110 transition-transform duration-300"
                                          />
                                        </div>
                                      ) : (
                                        <div className="mb-4 flex justify-center">
                                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <BookOpen className="w-10 h-10 text-blue-600" />
                                          </div>
                                        </div>
                                      )}

                                      <h3 className="font-poppins font-semibold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                                        {genre.name}
                                      </h3>

                                      <div className="mt-3 inline-block px-3 py-1 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        <span className="text-xs text-gray-600 font-poppins">
                                          Explore →
                                        </span>
                                      </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                  </button>
                                ))}
                              </div>
                            )}

                            {!genresLoading &&
                              (!genres || genres.length === 0) && (
                                <div className="text-center py-20">
                                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                                    <BookOpen className="w-10 h-10 text-gray-400" />
                                  </div>
                                  <p className="text-gray-500 font-poppins text-lg">
                                    No genres available at the moment.
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </nav>

              <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                <div className="flex items-center h-11 border border-[#D1D5DB] rounded-full hover:border-blue-300 focus-within:border-blue-500 transition-colors">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for books or merchandise..."
                    className="flex-1 h-11 bg-transparent focus:outline-none font-poppins text-sm text-[#1E293B] pl-5 pr-2"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-blue-50 transition-colors mr-[2px]"
                  >
                    <Search className="w-5 h-5 text-[#475569]" />
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="p-2 hover:bg-gray-50 rounded-lg transition-all duration-300"
                title="Contact Us"
                onClick={() =>
                  alert("Contact us: contact@bookverse.com or (021) 1234-5678")
                }
              >
                <Phone className="w-5 h-5 text-[#64748B]" strokeWidth={1.5} />
              </button>

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

              <div className="relative flex items-center" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={handleUserMenuToggle}
                      className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-lg transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                          isUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <UserMenuDropdown
                      isOpen={isUserMenuOpen}
                      onClose={() => setIsUserMenuOpen(false)}
                      user={user}
                      onMenuClick={handleMenuClick}
                      onLogout={handleLogout}
                    />
                  </>
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

        <div className="h-px bg-[#D1D5DB] w-full" />
      </header>

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
