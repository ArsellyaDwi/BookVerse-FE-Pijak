import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Quote, ThumbsUp, Share2, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function CommunityQuotesSection() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedQuotes, setLikedQuotes] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const sliderRef = useRef(null);

    const moodColors = {
        happiness: "bg-green-100 text-green-700",
        sadness: "bg-blue-100 text-blue-700",
        love: "bg-pink-100 text-pink-700",
        anger: "bg-red-100 text-red-700",
        anxiety: "bg-orange-100 text-orange-700",
        fear: "bg-purple-100 text-purple-700",
        hope: "bg-teal-100 text-teal-700",
        courage: "bg-indigo-100 text-indigo-700",
        excitement: "bg-yellow-100 text-yellow-700",
        inspiration: "bg-emerald-100 text-emerald-700",
        calm: "bg-gray-100 text-gray-700"
    };

    const isLoggedIn = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    const redirectToLogin = () => {
        toast.error('Please login first');
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const response = await axios.get('/quotes/community?limit=20');
            if (response.data.success) {
                const data = response.data.data;
                const topLiked = [...data].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
                setQuotes(topLiked);
                const liked = {};
                data.forEach(q => {
                    if (q.is_liked) liked[q.id] = true;
                });
                setLikedQuotes(liked);
            }
        } catch (error) {
            console.error('Failed to fetch quotes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (quoteId) => {
        if (!isLoggedIn()) {
            redirectToLogin();
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`/quotes/like/${quoteId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setLikedQuotes(prev => ({ ...prev, [quoteId]: response.data.liked }));
                setQuotes(prev => prev.map(q =>
                    q.id === quoteId
                        ? { ...q, likes_count: response.data.likes_count }
                        : q
                ));
            }
        } catch (error) {
            toast.error('Failed to like');
        }
    };

    const handleShare = (quote) => {
        const shareText = `"${quote.quote}" — ${quote.author_name || 'Anonymous'}`;
        navigator.clipboard.writeText(shareText);
        toast.success('Quote copied!');
    };

    const nextSlide = () => {
        if (quotes.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % quotes.length);
        }
    };

    const prevSlide = () => {
        if (quotes.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
        }
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            nextSlide();
        }
        if (touchStart - touchEnd < -50) {
            prevSlide();
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    const getVisibleQuotes = () => {
        if (typeof window === 'undefined') return [quotes[currentIndex]];
        const width = window.innerWidth;
        if (width >= 1024) return quotes.slice(currentIndex, currentIndex + 3);
        if (width >= 768) return quotes.slice(currentIndex, currentIndex + 2);
        return [quotes[currentIndex]];
    };

    if (loading) {
        return (
            <div className="bg-gray-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-10">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse" />
                        <div className="h-6 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded w-64 mx-auto mt-2 animate-pulse" />
                    </div>
                    <div className="flex justify-center">
                        <div className="w-full max-w-3xl">
                            <div className="bg-white rounded-xl p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                                <div className="h-20 bg-gray-100 rounded mb-4" />
                                <div className="h-3 bg-gray-100 rounded w-1/3 mb-4" />
                                <div className="flex justify-between">
                                    <div className="h-8 bg-gray-100 rounded w-16" />
                                    <div className="h-8 bg-gray-100 rounded w-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (quotes.length === 0) return null;

    const visibleQuotes = getVisibleQuotes();

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 md:py-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-8 sm:mb-10 md:mb-12">
                    <div className="flex justify-center mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center">
                            <Quote className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-poppins">
                        Most Loved Quotes
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                        Discover the most inspiring words from our community
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons - Desktop */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 lg:-translate-x-6 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg border border-gray-200 transition-all hover:bg-gray-50"
                        aria-label="Previous quote"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 lg:translate-x-6 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg border border-gray-200 transition-all hover:bg-gray-50"
                        aria-label="Next quote"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Quotes Slider */}
                    <div
                        ref={sliderRef}
                        className="overflow-hidden"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1))}%)`
                            }}
                        >
                            {quotes.map((quote) => (
                                <div
                                    key={quote.id}
                                    className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-3"
                                >
                                    <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                                        <div className="mb-3">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs capitalize ${moodColors[quote.mood] || 'bg-gray-100 text-gray-600'}`}>
                                                {quote.mood || 'thought'}
                                            </span>
                                        </div>

                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 line-clamp-4 min-h-[80px]">
                                            "{quote.quote}"
                                        </p>

                                        <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                            — {quote.author_name || 'Anonymous'}
                                        </p>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => handleLike(quote.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all min-h-[34px] ${likedQuotes[quote.id]
                                                        ? 'text-blue-600 bg-blue-50'
                                                        : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                                                    }`}
                                            >
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                                <span className="font-medium">{Number(quote.likes_count || 0)}</span>
                                            </button>

                                            <button
                                                onClick={() => handleShare(quote)}
                                                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all min-w-[32px] min-h-[32px] flex items-center justify-center"
                                                aria-label="Share quote"
                                            >
                                                <Share2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Swipe Indicator */}
                    <div className="flex justify-center gap-2 mt-6 md:hidden">
                        {quotes.slice(0, Math.min(5, quotes.length)).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? 'w-6 bg-blue-500'
                                        : 'w-1.5 bg-gray-300'
                                    }`}
                                aria-label={`Go to quote ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Desktop Dots Indicator */}
                    <div className="hidden md:flex justify-center gap-2 mt-8">
                        {quotes.slice(0, Math.min(8, Math.ceil(quotes.length / (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 2)))).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx * (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 2))}
                                className={`h-2 rounded-full transition-all duration-300 ${Math.floor(currentIndex / (typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 2)) === idx
                                        ? 'w-8 bg-blue-500'
                                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* View All Button */}
                <div className="text-center mt-8 sm:mt-10 md:mt-12">
                    <Link
                        to="/community"
                        className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all text-sm sm:text-base font-medium"
                    >
                        <span>View All Community Quotes</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}