// components/personality-section.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Brain, ArrowRight, TrendingUp, Sparkles, ChevronRight, User } from "lucide-react";
import { toast } from "sonner";
import BookCard from "./book-card";
import useQuery from "@/hooks/use-query";
import { buildStorageUrl } from "@/lib/helper";
import axios from "axios";

const ShimmerTrait = () => (
    <div className="animate-pulse">
        <div className="flex justify-between mb-1.5">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full"></div>
    </div>
);

const ShimmerGenre = () => (
    <div className="animate-pulse">
        <div className="h-7 bg-gray-200 rounded-full w-20"></div>
    </div>
);

const ShimmerBookCard = () => (
    <div className="animate-pulse">
        <div className="bg-gray-200 rounded-lg aspect-[2/3] w-full"></div>
        <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
);

export default function PersonalitySection() {
    const navigate = useNavigate();
    const [showAllBooks, setShowAllBooks] = useState(false);

    const {
        data: personalityStatus,
        loading,
        refetch: refetchStatus,
    } = useQuery({
        url: "/auth/personality-status",
        guard: true,
        doingOnce: true,
        mustLogin: true,
    });

    useEffect(() => {
        refetchStatus();
    }, []);

    const hasLogin = !!(axios.defaults.headers.common["Authorization"]);
    const hasCompletedQuiz = personalityStatus?.has_completed || false;
    const personalityResult = personalityStatus?.personality;
    const recommendedGenres = personalityStatus?.genres || [];
    const recommendedBooks = personalityStatus?.books || [];
    const displayBooks = showAllBooks ? recommendedBooks : recommendedBooks.slice(0, 5);

    if (!hasLogin) {
        return null;
    }

    // Loading state
    if (loading) {
        return (
            <section className="bg-white py-6 md:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                            <div>
                                <div className="h-6 md:h-7 bg-gray-200 rounded w-48 md:w-56 animate-pulse mb-1"></div>
                                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="h-4 md:h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <ShimmerTrait key={i} />
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <ShimmerGenre key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // User hasn't taken quiz yet
    if (!hasCompletedQuiz) {
        return (
            <section className="bg-white py-6 md:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                <Brain className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl md:text-2xl lg:text-[26px] font-bold text-gray-800 font-poppins">
                                Your Reading Personality
                            </h2>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 text-center border border-blue-100">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Brain className="w-8 h-8 text-blue-600" />
                        </div>

                        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 font-poppins">
                            Discover Your Reading Personality
                        </h3>

                        <p className="text-gray-600 text-sm md:text-base mb-6 max-w-md mx-auto">
                            Take our quick quiz to get personalized book recommendations based on your unique reading preferences and personality traits.
                        </p>

                        <button
                            onClick={() => navigate("/personality-quiz")}
                            className="group inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-poppins font-medium text-sm md:text-base shadow-md hover:shadow-lg active:scale-95"
                        >
                            Take the Quiz
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // User has completed quiz - show full section
    return (
        <section className="bg-white py-6 md:py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">

                {/* Header */}
                <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div>
                            <h2 className="text-xl md:text-2xl lg:text-[26px] font-bold text-gray-800 font-poppins">
                                Your Reading Personality
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500 font-poppins">
                                Based on your quiz answers
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/personality-quiz")}
                        className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all duration-300 font-poppins text-sm md:text-base font-medium cursor-pointer"
                    >
                        <span>View Full Analysis</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Personality Scores Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 mb-8 md:mb-10">
                    <div className="space-y-4">
                        {[
                            { label: "Openness", value: personalityResult?.openness || 0, icon: "🎨" },
                            { label: "Conscientiousness", value: personalityResult?.conscientiousness || 0, icon: "📋" },
                            { label: "Extroversion", value: personalityResult?.extroversion || 0, icon: "💬" },
                            { label: "Agreeableness", value: personalityResult?.agreeableness || 0, icon: "🤝" },
                            { label: "Neuroticism", value: personalityResult?.neuroticism || 0, icon: "🌊" },
                        ].map((trait) => (
                            <div key={trait.label} className="group">
                                <div className="flex justify-between text-sm mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 font-medium font-poppins">{trait.label}</span>
                                    </div>
                                    <span className="text-gray-600 text-xs font-medium font-poppins">
                                        {trait.value}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${trait.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recommended Genres */}
                    {recommendedGenres.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide font-poppins">
                                    Recommended Genres
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recommendedGenres.slice(0, 6).map((genre, index) => (
                                    <button
                                        key={index}
                                        onClick={() => navigate(`/books?genres=${genre.id}`)}
                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-poppins text-gray-700"
                                    >
                                        {genre.genre}
                                    </button>
                                ))}
                                {recommendedGenres.length > 6 && (
                                    <button
                                        onClick={() => navigate("/personality-quiz")}
                                        className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 transition font-poppins"
                                    >
                                        +{recommendedGenres.length - 6} more
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recommended Books Section */}
                {recommendedBooks.length > 0 && (
                    <>
                        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-4 md:mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg md:text-xl font-semibold text-gray-800 font-poppins">
                                    Recommended for You
                                </h3>
                                {!showAllBooks && recommendedBooks.length > 5 && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                        {recommendedBooks.length} books
                                    </span>
                                )}
                            </div>

                            {recommendedBooks.length > 5 && (
                                <button
                                    onClick={() => setShowAllBooks(!showAllBooks)}
                                    className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all duration-300 font-poppins text-sm font-medium"
                                >
                                    <span>{showAllBooks ? "Show Less" : `View All (${recommendedBooks.length})`}</span>
                                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showAllBooks ? "rotate-90" : "group-hover:translate-x-1"}`} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                            {displayBooks.map((book) => (
                                <BookCard
                                    key={book.id}
                                    id={book.id}
                                    title={book.title || "Untitled"}
                                    author={book.author?.split(",")[0] || book.author || "Unknown"}
                                    price={book.price || 0}
                                    rating={book.rating || 0}
                                    image={book.cover_img ? buildStorageUrl(book.cover_img) : null}
                                />
                            ))}
                        </div>

                        {/* View All Button (Alternative for smaller screens) */}
                        {!showAllBooks && recommendedBooks.length > 5 && (
                            <div className="mt-6 text-center md:hidden">
                                <button
                                    onClick={() => setShowAllBooks(true)}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-poppins font-medium text-sm shadow-md hover:shadow-lg active:scale-95"
                                >
                                    View All {recommendedBooks.length} Recommendations
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* No recommendations fallback */}
                {recommendedBooks.length === 0 && (
                    <div className="text-center py-10 md:py-12 bg-gray-50 rounded-xl">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-poppins text-sm md:text-base">
                            No recommendations available at the moment.
                        </p>
                        <button
                            onClick={() => navigate("/books")}
                            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-poppins"
                        >
                            Browse all books →
                        </button>
                    </div>
                )}

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-8 md:my-10 w-full" />
            </div>
        </section>
    );
}