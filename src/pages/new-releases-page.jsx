import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, BookOpen, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { buildStorageUrl } from "@/lib/helper";
import BookCard from "@/components/book-card";
import useQuery from "@/hooks/use-query";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const ShimmerCard = () => (
    <div className="animate-pulse">
        <div className="bg-gray-200 rounded-lg h-[300px] w-full"></div>
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
);

const ShimmerLoading = ({ count = 10 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(count)].map((_, index) => (
            <ShimmerCard key={index} />
        ))}
    </div>
);

export default function NewReleasesPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const { data: booksResponse, loading } = useQuery({
        url: "books",
        method: "GET",
        params: {
            sort_by: "created_at",
            sort_direction: "desc",
            per_page: 100,
        },
        immediate: true,
    });

    const allBooks = booksResponse?.data || booksResponse || [];
    const booksArray = Array.isArray(allBooks) ? allBooks : [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const totalPages = Math.ceil(booksArray.length / itemsPerPage);
    const paginatedBooks = booksArray.slice(startIndex, startIndex + itemsPerPage);

    const getBookImage = (coverImg) => {
        if (!coverImg) {
            return 'https://placehold.co/300x400/e2e8f0/94a3b8?text=No+Cover';
        }
        return buildStorageUrl(coverImg);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
                    <ShimmerLoading count={12} />
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">

                    {/* Breadcrumb */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 text-sm font-poppins text-white/70">
                            <Link to="/" className="hover:text-white transition-colors duration-300 hover:underline underline-offset-4">
                                Home
                            </Link>
                            <span>›</span>
                            <span className="text-white font-medium">New Releases</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-poppins">
                                New Releases
                            </h1>
                        </div>
                        <p className="text-lg text-blue-100 max-w-2xl mx-auto font-poppins">
                            Discover the newest books, fresh from the press
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <BookOpen className="w-5 h-5 text-blue-200" />
                            <span className="text-blue-100 font-poppins">{booksArray.length} new arrivals</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-gray-500">
                        <strong className="text-gray-900">{booksArray.length}</strong> newest books
                    </div>
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, booksArray.length)} of {booksArray.length}
                    </div>
                </div>

                {paginatedBooks.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {paginatedBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    id={book.id}
                                    title={book.title}
                                    author={book.author?.split(',')[0] || book.author}
                                    price={book.price}
                                    rating={book.rating || 0}
                                    image={getBookImage(book.cover_img)}a
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No books found</h3>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}