import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import BookCard from "@/components/book-card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// Data lokal sebagai cadangan jika API server mati
import { booksData } from "@/data/booksData";

export default function GenresPage() {
  const { genre } = useParams();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genresLoading, setGenresLoading] = useState(true);

  // Sesuaikan URL ini dengan alamat backend kamu
  const API_BASE_URL = "http://127.0.0.1:8000";

  const fallbackGenres = [
    { name: "Romance", slug: "romance", image: "https://images.unsplash.com/photo-1735805819333-19bed84b654e?q=80&w=1080" },
    { name: "Fantasy", slug: "fantasy", image: "https://images.unsplash.com/photo-1772389634170-481480aa05b0?q=80&w=1080" },
    { name: "Mystery", slug: "mystery", image: "https://images.unsplash.com/photo-1698956483970-a47edef29331?q=80&w=1080" },
    { name: "History", slug: "history", image: "https://images.unsplash.com/photo-1767596657164-1ec901bf24f2?q=80&w=1080" },
    { name: "Self Development", slug: "self-development", image: "https://images.unsplash.com/photo-1772380407481-81b8f13bd010?q=80&w=1080" },
    { name: "Comics", slug: "comics", image: "https://images.unsplash.com/photo-1767050401645-5fe0eebc0289?q=80&w=1080" },
  ];

  // 1. Ambil Daftar Kategori (Genres)
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/genres`);
        const result = await response.json();
        if (result.success) {
          setGenres(result.data || []);
        } else {
          setGenres(fallbackGenres);
        }
      } catch (error) {
        console.warn("Using fallback genres due to API error");
        setGenres(fallbackGenres);
      } finally {
        setGenresLoading(false);
      }
    };
    fetchGenres();
  }, []);

  // 2. Ambil Daftar Buku berdasarkan Genre
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const url = genre === "all" 
          ? `${API_BASE_URL}/api/books` 
          : `${API_BASE_URL}/api/books/genre/${genre}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
          // Menangani kemungkinan perbedaan struktur data pagination dari backend
          const finalData = Array.isArray(result.data)
            ? result.data
            : (result.data?.data || []);
          setBooks(finalData);
        } else {
          handleLocalFallback();
        }
      } catch (error) {
        handleLocalFallback();
      } finally {
        setLoading(false);
      }
    };

    const handleLocalFallback = () => {
      const genreName = genre?.split("-").join(" ");
      const filtered = genre === "all"
        ? booksData
        : booksData.filter(b => b.category?.toLowerCase() === genreName?.toLowerCase());
      setBooks(filtered);
    };

    fetchBooks();
  }, [genre]);

  // Helper untuk formatting nama genre (misal: "self-development" jadi "Self Development")
  const formattedGenreName = genre
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-20 pt-16 pb-20">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-12 transition-colors font-poppins no-underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="font-poppins text-4xl font-bold text-gray-800 mb-4">
            {genre === "all" ? "Explore Categories" : formattedGenreName}
          </h1>
          {genre !== "all" && !loading && (
            <p className="font-poppins text-lg text-gray-500">
              {books.length} {books.length === 1 ? "book" : "books"} found in this category
            </p>
          )}
        </div>

        {/* Tampilan Utama: Grid Genre atau Grid Buku */}
        {genre === "all" ? (
          /* Grid List Kategori */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {genres.map((g) => (
              <Link
                key={g.slug}
                to={`/genres/${g.slug}`}
                className="group relative h-56 rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {g.image ? (
                  <img
                    src={g.image.startsWith('http') ? g.image : `${API_BASE_URL}/storage/${g.image}`}
                    alt={g.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-poppins text-xl font-bold text-white mb-1 group-hover:translate-x-2 transition-transform duration-300">
                    {g.name}
                  </h3>
                  <p className="text-white/70 text-sm flex items-center gap-2 group-hover:text-white">
                    Explore Now <span className="transition-transform group-hover:translate-x-2">→</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Detail Buku Per Genre */
          <>
            {/* Filter Pills */}
            {!genresLoading && (
              <div className="flex flex-wrap gap-3 mb-12">
                <Link
                  to="/genres/all"
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all no-underline border ${
                    genre === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:border-blue-500"
                  }`}
                >
                  All
                </Link>
                {genres.map((g) => (
                  <Link
                    key={g.slug}
                    to={`/genres/${g.slug}`}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all no-underline border ${
                      genre === g.slug ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 hover:border-blue-500"
                    }`}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Books Grid Rendering */}
            {loading ? (
              <div className="flex flex-col items-center py-32">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-poppins">Fetching books...</p>
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {books.map((book) => (
                  <BookCard 
                    key={book.id} 
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    price={book.price}
                    rating={book.rating}
                    // Handle image logic: prioritaskan full URL, baru fallback ke storage API
                    image={book.image?.startsWith('http') ? book.image : (book.cover_img ? `${API_BASE_URL}/storage/${book.cover_img}` : '/placeholder-book.png')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-3xl">
                <p className="font-poppins text-xl text-gray-500 mb-6">Oops! No books found here.</p>
                <Link to="/genres/all" className="bg-blue-600 text-white px-8 py-3 rounded-full no-underline hover:bg-blue-700 transition-colors">
                  Back to Categories
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}