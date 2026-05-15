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
import axios from "axios";

const buildStorageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_STORAGE_URL || '';
  return `${baseUrl}/${path}`;
};

const getGradientByIndex = (index) => {
  const gradients = [
    "from-rose-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-purple-500 to-indigo-500",
    "from-amber-500 to-orange-500",
    "from-green-500 to-lime-500",
    "from-red-500 to-orange-500",
    "from-indigo-500 to-purple-500",
  ];
  return gradients[index % gradients.length];
};

const createSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const GenreCard = ({ genre, index, onClose }) => {
  const [imageError, setImageError] = useState(false);
  const gradientClass = getGradientByIndex(index);
  const imageUrl = genre.image_url ? buildStorageUrl(genre.image_url) : null;
  const hasImage = imageUrl && !imageError;
  const slugOrId = genre.slug || createSlug(genre.name) || genre.id;

  return (
    <Link 
      to={`/genres/${slugOrId}`}
      onClick={onClose}
      className="genre-card"
    >
      <div className="genre-card-media">
        {hasImage ? (
          <>
            <img 
              src={imageUrl} 
              alt={genre.name}
              className="genre-card-image"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className="genre-card-overlay" />
          </>
        ) : (
          <div className={`genre-card-gradient ${gradientClass}`} />
        )}
      </div>

      <div className="genre-card-content">
        <div className={`genre-icon-wrapper ${!hasImage ? gradientClass : ''}`}>
          {hasImage ? (
            <img 
              src={imageUrl} 
              alt="" 
              className="genre-icon-image"
              onError={() => setImageError(true)}
            />
          ) : (
            <BookOpen className="genre-icon-svg" />
          )}
        </div>
        <h3 className="genre-name">{genre.name}</h3>
        <p className="genre-count">{genre.books_count || 0} books</p>
      </div>

      <div className="genre-card-border" />
    </Link>
  );
};

export default function Navbar() {
  const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(false);
  const { wishlistItems } = useWishlist();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const mobileNavItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Books", path: "/books", icon: <Library size={20} /> },
    { name: "Contact", path: "/contact", icon: <Mail size={20} /> },
  ];

  useEffect(() => {
    if (isGenresDropdownOpen && genres.length === 0 && !genresLoading) {
      const fetchGenres = async () => {
        setGenresLoading(true);
        try {
          const response = await axios.get("/genre");
          let genresData = [];
          if (Array.isArray(response.data)) {
            genresData = response.data;
          } else if (response.data && response.data.data) {
            genresData = response.data.data;
          }
          
          const processedGenres = genresData.map(genre => ({
            ...genre,
            slug: genre.slug || createSlug(genre.name),
            image_url: genre.image || genre.cover_img || null,
            books_count: genre.books_count || genre.book_count || 0
          }));
          
          setGenres(processedGenres);
        } catch (error) {
          console.error("Failed to fetch genres:", error);
        } finally {
          setGenresLoading(false);
        }
      };
      fetchGenres();
    }
  }, [isGenresDropdownOpen, genres.length, genresLoading]);

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
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGenresDropdownOpen, isUserMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen || isGenresDropdownOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen, isGenresDropdownOpen]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsGenresDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

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

  const closeAllModals = () => {
    setIsGenresDropdownOpen(false);
    setIsMobileMenuOpen(false);
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
    <div className="mobile-menu-content">
      <div className="mobile-menu-header">
        <img src={logoImage} alt="BookVerse" className="mobile-menu-logo" />
        <button onClick={() => setIsMobileMenuOpen(false)} className="mobile-menu-close">
          <X size={20} />
        </button>
      </div>
      
      <div className="mobile-menu-nav">
        {mobileNavItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleMobileNavClick(item.path)}
            className="mobile-menu-item"
          >
            <span className="mobile-menu-icon">{item.icon}</span>
            {item.name}
          </button>
        ))}
        
        <div className="mobile-menu-divider" />
        
        <button
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsGenresDropdownOpen(true);
          }}
          className="mobile-menu-item"
        >
          <Tag size={20} className="mobile-menu-icon" />
          All Genres
        </button>
      </div>
      
      <div className="mobile-menu-footer">
        <span>© 2025 BookVerse</span>
        <span>v1.0.0</span>
      </div>
    </div>
  );

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <button onClick={handleLogoClick} className="navbar-logo">
            <img src={logoImage} alt="BookVerse" />
          </button>

          <div className="navbar-desktop">
            <Link to="/" className="navbar-link">Home</Link>
            <div className="navbar-genres-wrapper" ref={dropdownRef}>
              <button
                onClick={() => setIsGenresDropdownOpen(!isGenresDropdownOpen)}
                className={`navbar-link genres-button ${isGenresDropdownOpen ? 'active' : ''}`}
              >
                <span>All Genres</span>
                <ChevronDown className={`genres-chevron ${isGenresDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {isGenresDropdownOpen && (
                <div className="genres-dropdown">
                  <div className="genres-dropdown-header">
                    <h3>Browse All Genres</h3>
                    <p>Find books that match your mood</p>
                  </div>
                  
                  {genresLoading ? (
                    <div className="genres-loading">
                      <div className="loading-spinner-small" />
                      <span>Loading genres...</span>
                    </div>
                  ) : (
                    <div className="genres-dropdown-grid">
                      {genres.slice(0, 12).map((genre, idx) => {
                        const slugOrId = genre.slug || createSlug(genre.name) || genre.id;
                        return (
                          <Link
                            key={genre.id}
                            to={`/genres/${slugOrId}`}
                            onClick={closeAllModals}
                            className="genre-dropdown-item"
                          >
                            <div className="genre-dropdown-icon">
                              {genre.image_url ? (
                                <img 
                                  src={buildStorageUrl(genre.image_url)} 
                                  alt=""
                                  className="genre-dropdown-img"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <div className={`genre-dropdown-fallback ${getGradientByIndex(idx)}`}>
                                  <BookOpen size={14} />
                                </div>
                              )}
                            </div>
                            <div className="genre-dropdown-info">
                              <span className="genre-dropdown-name">{genre.name}</span>
                              <span className="genre-dropdown-count">{genre.books_count || 0} books</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  
                  <Link 
                    to="/genres"
                    onClick={closeAllModals}
                    className="genres-dropdown-footer"
                  >
                    View All Genres →
                  </Link>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="navbar-search">
            <div className="search-wrapper">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search for books..." 
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <Search className="search-icon" />
              </button>
            </div>
          </form>

          <div className="navbar-actions">
            <button className="action-icon contact-btn" onClick={() => navigate("/contact")}>
              <Phone className="action-icon-svg" />
            </button>

            <button onClick={handleWishlistClick} className="action-icon relative">
              <Heart className="action-icon-svg" />
              {wishlistItems.length > 0 && (
                <span className="badge">{wishlistItems.length}</span>
              )}
            </button>

            <button onClick={handleCartClick} className="action-icon relative">
              <ShoppingCart className="action-icon-svg" />
              {getTotalItems() > 0 && (
                <span className="badge cart-badge">{getTotalItems()}</span>
              )}
            </button>

            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <button onClick={handleUserMenuToggle} className="action-icon user-menu-btn">
                    <div className="user-avatar">
                      <User className="user-avatar-icon" />
                    </div>
                    <ChevronDown className={`user-menu-chevron ${isUserMenuOpen ? 'rotated' : ''}`} />
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
                <button onClick={() => setIsLoginOpen(!isLoginOpen)} className="action-icon">
                  <User className="action-icon-svg" />
                </button>
              )}
              <LoginDropdown isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="mobile-menu-trigger"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mobile-search">
          <div className="mobile-search-wrapper">
            <Search className="mobile-search-icon" />
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search for books..." 
              className="mobile-search-input"
            />
            <button type="submit" className="mobile-search-submit">
              Search
            </button>
          </div>
        </form>
      </header>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      <div ref={mobileMenuRef} className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <MobileMenuContent />
      </div>

      {isGenresDropdownOpen && (
        <div className="genres-modal">
          <div className="genres-modal-header">
            <div className="genres-modal-title">
              <img src={logoImage} alt="BookVerse" className="genres-modal-logo" />
              <h2>Browse All Genres</h2>
            </div>
            <button onClick={() => setIsGenresDropdownOpen(false)} className="genres-modal-close">
              <X size={24} />
            </button>
          </div>

          <div className="genres-modal-body">
            <div className="genres-hero">
              <h1 className="genres-hero-title">Discover Your Next Read</h1>
              <p className="genres-hero-subtitle">Explore our collection of genres and find books that match your mood</p>
            </div>

            {genresLoading ? (
              <div className="genres-loading-full">
                <div className="loading-spinner" />
                <p>Loading genres...</p>
              </div>
            ) : (
              <>
                <div className="genres-grid">
                  {genres.map((genre, idx) => (
                    <GenreCard 
                      key={genre.id} 
                      genre={genre} 
                      index={idx}
                      onClose={closeAllModals}
                    />
                  ))}
                </div>
                <div className="genres-footer">
                  <p>{genres.length} genres • Find the perfect book for your mood</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <style jsx>{`
        :root {
          --navbar-height-mobile: 64px;
          --navbar-height-tablet: 72px;
          --navbar-height-desktop: 80px;
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }

        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: white;
          box-shadow: var(--shadow-sm);
          border-bottom: 1px solid var(--gray-100);
        }

        .navbar-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          min-height: var(--navbar-height-mobile);
        }

        @media (min-width: 640px) {
          .navbar-container {
            padding: 0.875rem 1.5rem;
            gap: 1rem;
          }
        }

        @media (min-width: 768px) {
          .navbar-container {
            min-height: var(--navbar-height-tablet);
            padding: 1rem 1.5rem;
            gap: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .navbar-container {
            min-height: var(--navbar-height-desktop);
            padding: 1rem 2rem;
            gap: 2rem;
          }
        }

        .navbar-logo {
          flex-shrink: 0;
          cursor: pointer;
          transition: opacity 0.2s ease;
          background: transparent;
          border: none;
          padding: 0;
        }

        .navbar-logo:hover {
          opacity: 0.8;
        }

        .navbar-logo img {
          height: 28px;
          width: auto;
        }

        @media (min-width: 640px) {
          .navbar-logo img {
            height: 32px;
          }
        }

        @media (min-width: 768px) {
          .navbar-logo img {
            height: 36px;
          }
        }

        .navbar-desktop {
          display: none;
          align-items: center;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .navbar-desktop {
            display: flex;
          }
        }

        .navbar-link {
          color: var(--gray-600);
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .navbar-link:hover {
          color: var(--primary);
        }

        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          border-radius: 2px;
          transition: width 0.2s ease;
        }

        .navbar-link:hover::after {
          width: 100%;
        }

        .genres-button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .genres-chevron {
          width: 14px;
          height: 14px;
          transition: transform 0.2s ease;
        }

        .genres-chevron.rotated {
          transform: rotate(180deg);
        }

        .navbar-genres-wrapper {
          position: relative;
        }

        .genres-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 320px;
          background: white;
          border-radius: 1rem;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--gray-100);
          overflow: hidden;
          z-index: 50;
          animation: dropdownFadeIn 0.2s ease;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .genres-dropdown-header {
          padding: 1rem 1rem 0.5rem 1rem;
          border-bottom: 1px solid var(--gray-100);
        }

        .genres-dropdown-header h3 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 0.25rem;
        }

        .genres-dropdown-header p {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .genres-dropdown-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          padding: 0.75rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .genre-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem;
          border-radius: 0.75rem;
          transition: all 0.2s ease;
          cursor: pointer;
          background: transparent;
          text-decoration: none;
          width: 100%;
        }

        .genre-dropdown-item:hover {
          background: var(--gray-50);
          transform: translateX(2px);
        }

        .genre-dropdown-icon {
          width: 36px;
          height: 36px;
          border-radius: 0.5rem;
          overflow: hidden;
          flex-shrink: 0;
        }

        .genre-dropdown-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .genre-dropdown-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
        }

        .genre-dropdown-info {
          flex: 1;
          min-width: 0;
        }

        .genre-dropdown-name {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--gray-700);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .genre-dropdown-count {
          display: block;
          font-size: 0.6875rem;
          color: var(--gray-400);
        }

        .genres-dropdown-footer {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--primary);
          border-top: 1px solid var(--gray-100);
          background: var(--gray-50);
          transition: background 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .genres-dropdown-footer:hover {
          background: var(--gray-100);
        }

        .genres-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 2rem;
        }

        .loading-spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid var(--gray-200);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .navbar-search {
          display: none;
          flex: 1;
          max-width: 400px;
        }

        @media (min-width: 768px) {
          .navbar-search {
            display: block;
          }
        }

        @media (min-width: 1024px) {
          .navbar-search {
            max-width: 500px;
          }
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          width: 100%;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 100px;
          transition: all 0.2s ease;
        }

        .search-wrapper:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          background: white;
        }

        .search-input {
          flex: 1;
          height: 40px;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8125rem;
          color: var(--gray-800);
          padding-left: 1rem;
          padding-right: 0.5rem;
          border-radius: 100px;
        }

        .search-input::placeholder {
          color: var(--gray-400);
        }

        .search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 100px;
          transition: all 0.2s ease;
          margin-right: 2px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--gray-500);
        }

        .search-btn:hover {
          background: var(--gray-100);
          color: var(--primary);
        }

        .search-icon {
          width: 16px;
          height: 16px;
        }

        @media (min-width: 768px) {
          .search-input {
            height: 44px;
            font-size: 0.875rem;
          }
          .search-icon {
            width: 18px;
            height: 18px;
          }
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        @media (min-width: 640px) {
          .navbar-actions {
            gap: 0.5rem;
          }
        }

        .action-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          min-width: 40px;
          min-height: 40px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--gray-600);
          position: relative;
        }

        .action-icon:hover {
          background: var(--gray-100);
          color: var(--primary);
          transform: translateY(-1px);
        }

        .action-icon:active {
          transform: scale(0.96);
        }

        .action-icon-svg {
          width: 20px;
          height: 20px;
        }

        @media (min-width: 640px) {
          .action-icon-svg {
            width: 22px;
            height: 22px;
          }
        }

        .contact-btn {
          display: none;
        }

        @media (min-width: 640px) {
          .contact-btn {
            display: flex;
          }
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 100px;
          background: linear-gradient(135deg, var(--primary), #6366f1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-avatar-icon {
          width: 14px;
          height: 14px;
          color: white;
        }

        @media (min-width: 640px) {
          .user-avatar {
            width: 32px;
            height: 32px;
          }
          .user-avatar-icon {
            width: 16px;
            height: 16px;
          }
        }

        .user-menu-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .user-menu-chevron {
          width: 12px;
          height: 12px;
          transition: transform 0.2s ease;
        }

        .user-menu-chevron.rotated {
          transform: rotate(180deg);
        }

        .badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 100px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.625rem;
          font-weight: 600;
          width: 18px;
          height: 18px;
        }

        .cart-badge {
          background: var(--primary);
        }

        .mobile-menu-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          min-width: 40px;
          min-height: 40px;
          color: var(--gray-600);
          transition: all 0.2s ease;
        }

        .mobile-menu-trigger:hover {
          background: var(--gray-100);
        }

        @media (min-width: 1024px) {
          .mobile-menu-trigger {
            display: none;
          }
        }

        .mobile-search {
          padding: 0.75rem 1rem 1rem 1rem;
          border-top: 1px solid var(--gray-100);
          background: white;
        }

        @media (min-width: 768px) {
          .mobile-search {
            display: none;
          }
        }

        .mobile-search-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 100px;
          padding: 0.25rem 0.25rem 0.25rem 0.75rem;
        }

        .mobile-search-icon {
          width: 18px;
          height: 18px;
          color: var(--gray-400);
          flex-shrink: 0;
        }

        .mobile-search-input {
          flex: 1;
          height: 40px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          font-family: 'Poppins', sans-serif;
        }

        .mobile-search-submit {
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 100px;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .mobile-search-submit:hover {
          background: var(--primary-dark);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: min(320px, 85%);
          background: white;
          box-shadow: var(--shadow-xl);
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 200;
          overflow-y: auto;
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 199;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        @media (min-width: 1024px) {
          .mobile-menu,
          .mobile-menu-overlay {
            display: none;
          }
        }

        .mobile-menu-content {
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--gray-100);
        }

        .mobile-menu-logo {
          height: 28px;
          width: auto;
        }

        .mobile-menu-close {
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--gray-500);
          transition: all 0.2s ease;
        }

        .mobile-menu-close:hover {
          background: var(--gray-100);
        }

        .mobile-menu-nav {
          flex: 1;
          padding: 0.75rem;
        }

        .mobile-menu-item {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          width: 100%;
          padding: 0.875rem 1rem;
          color: var(--gray-700);
          background: transparent;
          border: none;
          border-radius: 0.75rem;
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9375rem;
          font-weight: 500;
        }

        .mobile-menu-item:hover {
          background: var(--gray-50);
          color: var(--primary);
        }

        .mobile-menu-icon {
          width: 20px;
          height: 20px;
          color: var(--gray-400);
        }

        .mobile-menu-divider {
          height: 1px;
          background: var(--gray-100);
          margin: 0.75rem 0;
        }

        .mobile-menu-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--gray-100);
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--gray-400);
          background: var(--gray-50);
        }

        .genres-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: white;
          overflow-y: auto;
          animation: modalSlideUp 0.3s ease;
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .genres-modal-header {
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--gray-100);
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 10;
        }

        @media (min-width: 640px) {
          .genres-modal-header {
            padding: 1rem 1.5rem;
          }
        }

        .genres-modal-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .genres-modal-logo {
          height: 32px;
          width: auto;
        }

        .genres-modal-title h2 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-800);
        }

        .genres-modal-close {
          padding: 0.5rem;
          border-radius: 100px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .genres-modal-close:hover {
          background: var(--gray-100);
        }

        .genres-modal-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }

        @media (min-width: 640px) {
          .genres-modal-body {
            padding: 2rem 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .genres-modal-body {
            padding: 3rem 2rem;
          }
        }

        .genres-hero {
          text-align: center;
          margin-bottom: 2rem;
        }

        .genres-hero-title {
          font-size: clamp(1.5rem, 5vw, 2.25rem);
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 0.5rem;
        }

        .genres-hero-subtitle {
          font-size: clamp(0.875rem, 3vw, 1rem);
          color: var(--gray-500);
          max-width: 28rem;
          margin: 0 auto;
        }

        .genres-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (min-width: 480px) {
          .genres-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }

        @media (min-width: 768px) {
          .genres-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
          }
        }

        @media (min-width: 1024px) {
          .genres-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 1.5rem;
          }
        }

        .genre-card {
          position: relative;
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--gray-100);
          text-decoration: none;
          display: block;
        }

        .genre-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: transparent;
        }

        .genre-card-media {
          position: relative;
          width: 100%;
          padding-top: 75%;
          overflow: hidden;
        }

        .genre-card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .genre-card:hover .genre-card-image {
          transform: scale(1.05);
        }

        .genre-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
        }

        .genre-card-gradient {
          position: absolute;
          inset: 0;
        }

        .genre-card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem;
          z-index: 2;
        }

        .genre-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          background: white;
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .genre-icon-wrapper {
            width: 56px;
            height: 56px;
          }
        }

        .genre-icon-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .genre-icon-svg {
          width: 24px;
          height: 24px;
          color: white;
        }

        @media (min-width: 640px) {
          .genre-icon-svg {
            width: 28px;
            height: 28px;
          }
        }

        .genre-name {
          font-weight: 600;
          color: white;
          font-size: clamp(0.875rem, 3vw, 1rem);
          margin-bottom: 0.25rem;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .genre-count {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        .genre-card-border {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary), #6366f1);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .genre-card:hover .genre-card-border {
          transform: scaleX(1);
        }

        .genres-footer {
          text-align: center;
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--gray-100);
          font-size: 0.75rem;
          color: var(--gray-400);
        }

        .genres-loading-full {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          gap: 1rem;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid var(--gray-200);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}