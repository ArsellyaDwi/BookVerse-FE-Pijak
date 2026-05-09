import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
    ArrowLeft,
    Search,
    BookOpen,
    TrendingUp,
    Star,
    ChevronLeft,
    ChevronRight,
    Grid3x3,
    List,
    Filter,
    X
} from "lucide-react";
import useQuery from "@/hooks/use-query";
import { buildStorageUrl } from "@/lib/helper";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function GenresPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [genresWithImages, setGenresWithImages] = useState([]);
    const [isLoadingImages, setIsLoadingImages] = useState(true);
    const itemsPerPage = 12;

    const getGenres = useQuery({
        url: "genre",
    });

    useEffect(() => {
        const fetchTopBookImages = async () => {
            if (!getGenres.data || getGenres.loading) return;

            setIsLoadingImages(true);
            const genres = getGenres.data;

            const updatedGenres = await Promise.all(
                genres.map(async (genre) => {
                    try {
                        const url = `/api/genres/${genre.id}/books?per_page=1`;
                        console.log("🔍 Fetching:", url);

                        const response = await fetch(url);

                        if (!response.ok) {
                            console.warn(`⚠️ Genre ${genre.slug} tidak punya endpoint atau buku, skip`);
                            return genre;
                        }

                        const result = await response.json();

                        if (!result?.success || !result?.data?.length) {
                            console.warn(`⚠️ Genre ${genre.slug} tidak memiliki buku`);
                            return genre;
                        }

                        const firstBook = result.data[0];

                        console.log(`✅ ${genre.name}: ${firstBook.title}`);

                        return {
                            ...genre,
                            image: firstBook?.cover_img ? buildStorageUrl(firstBook.cover_img) : null,
                        };
                    } catch (error) {
                        console.warn(`⚠️ Gagal ambil gambar untuk genre ${genre.slug}:`, error.message);
                        return genre;
                    }
                })
            );

            console.log("✅ Final result:", updatedGenres);
            setGenresWithImages(updatedGenres);
            setIsLoadingImages(false);
        };

        fetchTopBookImages();
    }, [getGenres.data, getGenres.loading]);

    // Gunakan genresWithImages untuk filtering (bukan getGenres.data langsung)
    const filteredGenres = (genresWithImages.length > 0 ? genresWithImages : getGenres.data || []).filter((genre) =>
        genre.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    // Sort genres by name or book count
    const [sortBy, setSortBy] = useState("name");
    const sortedGenres = [...filteredGenres].sort((a, b) => {
        if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
        if (sortBy === "books") return (b.book_count || 0) - (a.book_count || 0);
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedGenres.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedGenres = sortedGenres.slice(startIndex, startIndex + itemsPerPage);

    const handleGenreClick = (slug) => {
        navigate(`/genres/${slug}`);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const totalBooks = (genresWithImages.length > 0 ? genresWithImages : getGenres.data || []).reduce((acc, genre) => acc + (genre.book_count || 0), 0) || 0;

    const sortOptions = [
        { value: "name", label: "Name A-Z" },
        { value: "books", label: "Most Books" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-6"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span>Back</span>
                    </button>

                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins">
                            All Genres
                        </h1>
                        <p className="text-lg text-blue-100 max-w-2xl mx-auto font-poppins">
                            Explore our complete collection of book genres. Find your next favorite read.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search genres..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-poppins"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-4 py-3 border border-gray-200 rounded-xl outline-none font-poppins text-sm bg-white"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "grid"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Grid3x3 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "list"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Button (Mobile) */}
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <span className="text-gray-600 font-poppins">
                                <strong className="text-gray-900">{filteredGenres.length}</strong> Genres
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-gray-600 font-poppins">
                                <strong className="text-gray-900">{totalBooks}+</strong> Books
                            </span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredGenres.length)} of {filteredGenres.length} genres
                    </div>
                </div>

                {/* Loading State */}
                {(getGenres.loading || (isLoadingImages && genresWithImages.length === 0)) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-36 rounded-xl bg-slate-200"></div>
                                <div className="h-4 w-24 bg-slate-200 rounded mt-3 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Grid View */}
                {!getGenres.loading && viewMode === "grid" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {paginatedGenres.map((genre) => (
                            <button
                                key={genre.id}
                                onClick={() => handleGenreClick(genre.slug)}
                                className="group relative h-36 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                {genre.image ? (
                                    <img
                                        src={genre.image}
                                        alt={genre.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:bg-black/60 transition-all duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                    <span className="text-white font-poppins font-semibold text-base">
                                        {genre.name}
                                    </span>
                                    <div className="flex items-center justify-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-white/80 text-xs">
                                            {genre.book_count || 0} books
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* List View */}
                {!getGenres.loading && viewMode === "list" && (
                    <div className="space-y-4">
                        {paginatedGenres.map((genre) => (
                            <button
                                key={genre.id}
                                onClick={() => handleGenreClick(genre.slug)}
                                className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    {genre.image ? (
                                        <img src={genre.image} alt={genre.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-blue-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="font-poppins font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {genre.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {genre.book_count || 0} books available
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 group-hover:text-blue-600 transition-colors">
                                    <span className="text-sm">Explore</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!getGenres.loading && filteredGenres.length === 0 && (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No genres found</h3>
                        <p className="text-gray-500">Try searching with a different keyword</p>
                        <button
                            onClick={() => setSearchTerm("")}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-12" />
            </div>

            {/* Mobile Filter Drawer */}
            {isFilterOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 lg:hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 border rounded-xl"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
}