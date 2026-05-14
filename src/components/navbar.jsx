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
  Menu,
  Home,
  Library,
  Tag,
  Mail,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlistItems } = useWishlist();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

  const mobileNavItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Books", path: "/books", icon: <Library size={20} /> },
    { name: "Genres", path: "/genres/all", icon: <Tag size={20} /> },
    { name: "Contact", path: "/contact", icon: <Mail size={20} /> },
  ];

  useEffect(() => {
    if (isGenresDropdownOpen) {
      fetchGenres();
    }
  }, [isGenresDropdownOpen, fetchGenres]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

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
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGenresDropdownOpen, isUserMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsGenresDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate(`/books?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleWishlistClick = () => {
    setIsWishlistOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleGenreClick = (id, genreSlug, genreName) => {
    setIsGenresDropdownOpen(false);
    navigate(`/books?genres=${id}&name=${encodeURIComponent(genreName)}`);
  };

  const handleMobileNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const handleMenuClick = (path) => {
    setIsUserMenuOpen(false);
    navigate(path);
  };

  const MobileMenuContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
        <img src={logoImage} alt="BookVerse" className="h-8 w-auto" />
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-2">
        {mobileNavItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleMobileNavClick(item.path)}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all font-poppins text-sm font-medium"
          >
            <span className="text-gray-400">{item.icon}</span>
            {item.name}
          </button>
        ))}
        
        <div className="h-px bg-gray-100 my-3" />
        
        <button
          onClick={() => {
            setIsGenresDropdownOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all font-poppins text-sm font-medium"
        >
          <Tag size={20} className="text-gray-400" />
          All Genres
        </button>
      </div>
      
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>© 2024 BookVerse</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
          <div className="flex items-center justify-between gap-4 py-3 md:py-4">
            
            <button
              onClick={handleLogoClick}
              className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity active:scale-95"
            >
              <img src={logoImage} alt="BookVerse Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
            </button>

            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-poppins text-sm lg:text-base font-medium">
                Home
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsGenresDropdownOpen(!isGenresDropdownOpen)}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors font-poppins text-sm lg:text-base font-medium"
                >
                  <span>All Genres</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isGenresDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isGenresDropdownOpen && (
                  <>
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsGenresDropdownOpen(false)} />
                    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 overflow-y-auto">
                      <div className="min-h-full bg-gradient-to-br from-gray-50 to-white">
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between z-40 border-b">
                          <div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent font-poppins">
                              All Genres
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-poppins">
                              Discover books by category
                            </p>
                          </div>
                          <button onClick={() => setIsGenresDropdownOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110 active:scale-95">
                            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                          </button>
                        </div>

                        <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl mx-auto">
                          {genresLoading ? (
                            <div className="flex justify-center items-center h-64">
                              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                              {genres?.map((genre) => (
                                <button
                                  key={genre.id}
                                  onClick={() => handleGenreClick(genre.id, genre.slug, genre.name)}
                                  className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100 hover:border-blue-200 overflow-hidden active:scale-95"
                                >
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <div className="relative z-10">
                                    {genre.image ? (
                                      <div className="mb-3 sm:mb-4 flex justify-center">
                                        <img src={genre.image} alt={genre.name} className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded-xl group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                                      </div>
                                    ) : (
                                      <div className="mb-3 sm:mb-4 flex justify-center">
                                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                          <BookOpen className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" />
                                        </div>
                                      </div>
                                    )}
                                    <h3 className="font-poppins font-semibold text-gray-900 text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                      {genre.name}
                                    </h3>
                                    <div className="mt-2 sm:mt-3 inline-block px-2 sm:px-3 py-1 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                                      <span className="text-xs text-gray-600 font-poppins">Explore →</span>
                                    </div>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md lg:max-w-xl">
              <div className="flex items-center w-full h-10 sm:h-11 border border-gray-300 rounded-full hover:border-blue-300 focus-within:border-blue-500 transition-colors bg-white">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for books..." className="flex-1 h-full bg-transparent focus:outline-none font-poppins text-sm text-gray-800 pl-4 pr-2 rounded-l-full" />
                <button type="submit" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 transition-colors mr-1 active:scale-95">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="hidden sm:flex p-2 hover:bg-gray-50 rounded-lg transition-all active:scale-95" onClick={() => navigate("/contact")}>
                <Phone className="w-5 h-5 text-gray-500" />
              </button>

              <button onClick={handleWishlistClick} className="relative p-2 hover:bg-gray-50 rounded-lg transition-all active:scale-95">
                <Heart className="w-5 h-5 text-gray-500" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white flex items-center justify-center rounded-full font-poppins text-[10px] font-semibold w-4 h-4 sm:w-[18px] sm:h-[18px] shadow-md">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button onClick={handleCartClick} className="relative p-2 hover:bg-gray-50 rounded-lg transition-all active:scale-95">
                <ShoppingCart className="w-5 h-5 text-gray-500" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white flex items-center justify-center rounded-full font-poppins text-[10px] font-semibold w-4 h-4 sm:w-[18px] sm:h-[18px] shadow-md">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <button onClick={handleUserMenuToggle} className="flex items-center gap-1 p-1 hover:bg-gray-50 rounded-lg transition-all active:scale-95">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    <UserMenuDropdown isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} user={user} onMenuClick={handleMenuClick} onLogout={handleLogout} />
                  </>
                ) : (
                  <button onClick={() => setIsLoginOpen(!isLoginOpen)} className="p-2 hover:bg-gray-50 rounded-lg transition-all active:scale-95">
                    <User className="w-5 h-5 text-gray-500" />
                  </button>
                )}
                <LoginDropdown isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
              </div>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-all active:scale-95" aria-label="Toggle menu">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="md:hidden mt-3 pb-3">
            <div className="flex items-center w-full h-10 border border-gray-300 rounded-full hover:border-blue-300 focus-within:border-blue-500 transition-colors bg-white">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for books..." className="flex-1 h-full bg-transparent focus:outline-none font-poppins text-sm text-gray-800 pl-4 pr-2 rounded-l-full" />
              <button type="submit" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-50 transition-colors mr-1 active:scale-95">
                <Search className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </form>

          <div ref={mobileMenuRef} className={`fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <MobileMenuContent />
          </div>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)} />
          )}
        </div>
      </header>

      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}