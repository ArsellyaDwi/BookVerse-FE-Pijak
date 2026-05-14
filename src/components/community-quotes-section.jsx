    import { useState, useEffect } from 'react';
    import { Link } from 'react-router';
    import { Quote, ThumbsUp, Share2, ArrowRight, Sparkles } from 'lucide-react';
    import axios from 'axios';
    import { toast } from 'sonner';

    export default function CommunityQuotesSection() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedQuotes, setLikedQuotes] = useState({});

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
        const response = await axios.get('/quotes/community?limit=4');
        if (response.data.success) {
            const data = response.data.data.slice(0, 4);
            setQuotes(data);
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

    if (loading) {
        return (
        <div className="bg-gray-50 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-64 mx-auto mt-2 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
                    <div className="h-16 bg-gray-100 rounded mb-4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                ))}
            </div>
            </div>
        </div>
        );
    }

    if (quotes.length === 0) return null;

    return (
        <div className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Section */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex justify-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                </div>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-poppins">
                Community Voices
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                What others are feeling right now
            </p>
            </div>

            {/* Quotes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {quotes.map((quote) => (
                <div
                key={quote.id}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
                >
                {/* Mood Badge */}
                <div className="mb-2 sm:mb-3">
                    <span className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs capitalize ${moodColors[quote.mood] || 'bg-gray-100 text-gray-600'}`}>
                    {quote.mood || 'thought'}
                    </span>
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                    "{quote.quote}"
                </p>

                {/* Author */}
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                    — {quote.author_name || 'Anonymous'}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-50">
                    <button
                    onClick={() => handleLike(quote.id)}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all min-h-[32px] sm:min-h-[36px] ${
                        likedQuotes[quote.id]
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                    }`}
                    >
                    <ThumbsUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{quote.likes_count || 0}</span>
                    </button>

                    <button
                    onClick={() => handleShare(quote)}
                    className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all min-w-[28px] min-h-[28px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center"
                    aria-label="Share quote"
                    >
                    <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                </div>
                </div>
            ))}
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