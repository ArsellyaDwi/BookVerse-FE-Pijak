import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Grid3x3,
    List,
    Filter,
    X,
    Quote,
    Plus,
    ThumbsUp,
    Share2,
    Check,
    Sparkles,
    AlertCircle,
    Trash2,
    EyeOff,
    MoreHorizontal
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CommunityQuotes() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState("grid");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMood, setSelectedMood] = useState("all");
    const [likedQuotes, setLikedQuotes] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [newQuote, setNewQuote] = useState({ quote: "", mood: "", isAnonymous: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectedEmotion, setDetectedEmotion] = useState(null);
    const [detectedConfidence, setDetectedConfidence] = useState(0);
    const [languageWarning, setLanguageWarning] = useState("");
    const [detectError, setDetectError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [quoteToDelete, setQuoteToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);

    const itemsPerPage = 12;
    const moodOptions = [
        { value: "all", label: "All Emotions" },
        { value: "happiness", label: "Happiness" },
        { value: "disgust", label: "Disgust" },
        { value: "jealousy", label: "Jealousy" },
        { value: "surprise", label: "Surprise" },
        { value: "gratitude", label: "Gratitude" },
        { value: "relief", label: "Relief" },
        { value: "guilt", label: "Guilt" },
        { value: "anger", label: "Anger" },
        { value: "disappointment", label: "Disappointment" },
        { value: "embarrassment", label: "Embarrassment" },
        { value: "anxiety", label: "Anxiety" },
        { value: "pride", label: "Pride" },
        { value: "hope", label: "Hope" },
        { value: "loneliness", label: "Loneliness" },
        { value: "excitement", label: "Excitement" },
        { value: "fear", label: "Fear" },
        { value: "sadness", label: "Sadness" },
        { value: "confusion", label: "Confusion" },
        { value: "love", label: "Love" },
        { value: "frustration", label: "Frustration" }
    ];

    const moodColors = {
        happiness: "bg-green-100 text-green-700",
        disgust: "bg-lime-100 text-lime-700",
        jealousy: "bg-emerald-100 text-emerald-700",
        surprise: "bg-amber-100 text-amber-700",
        gratitude: "bg-teal-100 text-teal-700",
        relief: "bg-cyan-100 text-cyan-700",
        guilt: "bg-violet-100 text-violet-700",
        anger: "bg-red-100 text-red-700",
        disappointment: "bg-orange-100 text-orange-700",
        embarrassment: "bg-pink-100 text-pink-700",
        anxiety: "bg-yellow-100 text-yellow-700",
        pride: "bg-indigo-100 text-indigo-700",
        hope: "bg-sky-100 text-sky-700",
        loneliness: "bg-slate-100 text-slate-700",
        excitement: "bg-purple-100 text-purple-700",
        fear: "bg-gray-100 text-gray-700",
        sadness: "bg-blue-100 text-blue-700",
        confusion: "bg-stone-100 text-stone-700",
        love: "bg-rose-100 text-rose-700",
        frustration: "bg-orange-100 text-orange-700"
    };

    const isEnglishText = useCallback((text) => {
        return !/[^\x00-\x7F]/.test(text);
    }, []);

    useEffect(() => {
        if (!newQuote.quote.trim() || newQuote.quote.length < 5) {
            setDetectedEmotion(null);
            setDetectedConfidence(0);
            setDetectError(null);
            setLanguageWarning("");
            return;
        }

        // if (!isEnglishText(newQuote.quote)) {
        //     setLanguageWarning("Please use English only. Our AI works best with English text.");
        //     setDetectedEmotion(null);
        //     return;
        // } else {
        //     setLanguageWarning("");
        // }

        const timer = setTimeout(async () => {
            setIsDetecting(true);
            setDetectError(null);

            try {
                const response = await axios.post("/emotion/detect", {
                    text: newQuote.quote
                });

                if (response.data.success) {
                    const predictions = response.data.data?.predictions || [];
                    if (predictions.length > 0) {
                        const topEmotion = predictions[0].emotion;
                        const confidence = predictions[0].confidence;

                        setDetectedEmotion(topEmotion);
                        setDetectedConfidence(Math.round(confidence * 100));

                        if (confidence > 0.7 && !newQuote.mood) {
                            setNewQuote(prev => ({ ...prev, mood: topEmotion }));
                            toast.success(`Detected: ${topEmotion} (${Math.round(confidence * 100)}% confident)`);
                        }
                    }
                }
            } catch (error) {
                console.error("Emotion detection failed:", error);
                setDetectError("Could not detect mood automatically");
            } finally {
                setIsDetecting(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [newQuote.quote, isEnglishText, newQuote.mood]);

    const isLoggedIn = () => {
        const token = localStorage.getItem("token");
        return !!token;
    };

    const redirectToLogin = () => {
        toast.error("Please login first");
        navigate("/login");
    };

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            let url = "/quotes/community";
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);
            if (selectedMood !== "all") params.append("mood", selectedMood);
            if (params.toString()) url += `?${params.toString()}`;

            const response = await axios.get(url);
            if (response.data.success) {
                console.log("=== CHECK is_owner ===");
                response.data.data.forEach(q => {
                    console.log(`Quote ID: ${q.id}, is_owner: ${q.is_owner}, user_id: ${q.user_id}`);
                });
                setQuotes(response.data.data);
                const liked = {};
                response.data.data.forEach(q => {
                    if (q.is_liked) liked[q.id] = true;
                });
                setLikedQuotes(liked);
            }
        } catch (error) {
            console.error("Failed to fetch quotes:", error);
        } finally {
            setLoading(false);
        }
    };
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Current user ID from token:", payload.sub || payload.user_id);
        } catch (e) {
            console.log("Cannot decode token");
        }
    }

    useEffect(() => {
        fetchQuotes();
    }, [searchTerm, selectedMood]);

    const handleLike = async (quoteId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login first");
                navigate("/login");
                return;
            }

            const response = await axios({
                method: 'POST',
                url: `/quotes/like/${quoteId}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setLikedQuotes(prev => ({ ...prev, [quoteId]: response.data.liked }));
                setQuotes(prev => prev.map(q =>
                    q.id === quoteId
                        ? { ...q, likes_count: response.data.likes_count, is_liked: response.data.liked }
                        : q
                ));
            }
        } catch (error) {
            console.error("Full error:", error);
            console.error("Response:", error.response);

            if (error.response?.status === 401) {
                toast.error("Please login again");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                toast.error(error.response?.data?.message || "Failed to like");
            }
        }
    };

    const handleShare = (quote) => {
        const shareText = `"${quote.quote}" — ${quote.author_name || "Anonymous"}`;
        navigator.clipboard.writeText(shareText);
        toast.success("Quote copied to clipboard!");
    };

    const handleDeleteClick = (quote) => {
        setQuoteToDelete(quote);
        setShowDeleteModal(true);
        setOpenMenuId(null);
    };

    const confirmDelete = async () => {
        if (!quoteToDelete) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`/quotes/delete/${quoteToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Quote deleted successfully");
                fetchQuotes();
            } else {
                toast.error(response.data.message || "Failed to delete");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete quote");
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setQuoteToDelete(null);
        }
    };

    const handleAddQuote = async () => {
        if (!newQuote.quote.trim()) {
            toast.error("Please write a quote");
            return;
        }

        if (!newQuote.mood) {
            toast.error("Please select a mood or let AI detect it");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("/quotes/add", {
                quote: newQuote.quote,
                mood: newQuote.mood,
                is_anonymous: newQuote.isAnonymous
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success("Your quote has been shared!");
                setShowAddModal(false);
                setNewQuote({ quote: "", mood: "", isAnonymous: false });
                setDetectedEmotion(null);
                setDetectedConfidence(0);
                fetchQuotes();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add quote");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredQuotes = quotes.filter(quote =>
        quote.quote?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedQuotes = filteredQuotes.slice(startIndex, startIndex + itemsPerPage);
    const totalLikes = filteredQuotes.reduce((acc, q) => acc + Number(q.likes_count || 0), 0);

    const sortOptions = [
        { value: "newest", label: "Newest First" },
        { value: "popular", label: "Most Liked" }
    ];
    const [sortBy, setSortBy] = useState("newest");

    const sortedQuotes = [...paginatedQuotes].sort((a, b) => {
        if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
        if (sortBy === "popular") return (b.likes_count || 0) - (a.likes_count || 0);
        return 0;
    });

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
                    <div className="mb-4 sm:mb-6">
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-poppins text-white/80">
                            <Link to="/" className="hover:text-white transition-colors hover:underline">
                                Home
                            </Link>
                            <span>›</span>
                            <span className="text-white/60">Community</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="flex justify-center mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 font-poppins">
                            Community Voices
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto font-poppins px-4">
                            Share your feelings and see what others are going through
                        </p>
                        <button
                            onClick={() => {
                                if (!isLoggedIn()) redirectToLogin();
                                else setShowAddModal(true);
                            }}
                            className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all shadow-sm font-medium text-sm sm:text-base"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Share Your Quote</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6 sm:mb-8">
                    <div className="relative w-full lg:w-80 xl:w-96">
                        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search quotes..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-poppins text-sm sm:text-base"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl outline-none font-poppins text-sm bg-white"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        <select
                            value={selectedMood}
                            onChange={(e) => setSelectedMood(e.target.value)}
                            className="hidden md:block px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl outline-none font-poppins text-sm bg-white"
                        >
                            {moodOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>

                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === "grid"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 sm:p-2 rounded-lg transition-all ${viewMode === "list"
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <List className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="md:hidden flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 rounded-xl"
                        >
                            <Filter className="w-4 h-4" />
                            <span className="text-sm">Filter</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            <span className="text-xs sm:text-sm text-gray-600">
                                <strong className="text-gray-900">{filteredQuotes.length}</strong> Quotes
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            <span className="text-xs sm:text-sm text-gray-600">
                                <strong className="text-gray-900">{totalLikes.toLocaleString()}</strong> Likes
                            </span>
                        </div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length} quotes
                    </div>
                </div>

                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-32 rounded-xl bg-slate-200"></div>
                                <div className="h-4 w-24 bg-slate-200 rounded mt-3"></div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {sortedQuotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group relative"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs capitalize ${moodColors[quote.mood] || "bg-gray-100 text-gray-600"}`}>
                                        {quote.mood || "thought"}
                                    </span>
                                    {console.log("Render quote:", quote.id, "is_owner:", quote.is_owner)}
                                    {quote.is_owner && (
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenMenuId(openMenuId === quote.id ? null : quote.id);
                                                }}
                                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                            >
                                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                            </button>

                                            {openMenuId === quote.id && (
                                                <div className="absolute right-0 top-6 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 min-w-[120px]">
                                                    <button
                                                        onClick={() => handleDeleteClick(quote)}
                                                        className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                        Delete Quote
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 line-clamp-4">
                                    "{quote.quote}"
                                </p>

                                <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                    — {quote.author_name ? quote.author_name : 'Anonymous'}
                                </p>
                                <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-50">
                                    <button
                                        onClick={() => handleLike(quote.id)}
                                        className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm transition-all ${likedQuotes[quote.id]
                                            ? "text-blue-600 bg-blue-50"
                                            : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                                            }`}
                                    >
                                        <ThumbsUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span>{quote.likes_count || 0}</span>
                                    </button>
                                    <button
                                        onClick={() => handleShare(quote)}
                                        className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                    >
                                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && viewMode === "list" && (
                    <div className="space-y-3 sm:space-y-4">
                        {sortedQuotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                            <span className={`inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs capitalize ${moodColors[quote.mood] || "bg-gray-100 text-gray-600"}`}>
                                                {quote.mood || "thought"}
                                            </span>
                                            {quote.is_anonymous && (
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                                    <EyeOff className="w-3 h-3" />
                                                    Anonymous
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                                            "{quote.quote}"
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-400 mb-4">
                                            — {quote.author_name ? quote.author_name : 'Anonymous'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <button
                                            onClick={() => handleLike(quote.id)}
                                            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${likedQuotes[quote.id]
                                                ? "text-blue-600 bg-blue-50"
                                                : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                                                }`}
                                        >
                                            <ThumbsUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            <span>{quote.likes_count || 0}</span>
                                        </button>
                                        <button
                                            onClick={() => handleShare(quote)}
                                            className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                                        >
                                            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </button>

                                        {quote.is_owner && (
                                            <button
                                                onClick={() => handleDeleteClick(quote)}
                                                className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredQuotes.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                        <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No quotes found</h3>
                        <p className="text-sm sm:text-base text-gray-500">Try searching with a different keyword or mood</p>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedMood("all");
                            }}
                            className="mt-3 sm:mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-1 sm:gap-2 mt-8 sm:mt-12">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 sm:p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <span className="text-xs sm:text-sm text-gray-600 mx-2 sm:mx-3">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 sm:p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50 transition-all"
                        >
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                )}
            </div>

            {isFilterOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-4 sm:p-6 lg:hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base sm:text-lg font-semibold">Filters</h3>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-600 mb-1.5">Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-600 mb-1.5">Mood</label>
                                <select
                                    value={selectedMood}
                                    onChange={(e) => setSelectedMood(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                                >
                                    {moodOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}

            {showAddModal && (
                <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm z-9999">
                    <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md overflow-hidden shadow-xl max-h-[85vh] overflow-y-auto sm:my-8">
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                    <Quote className="w-4 h-4 text-blue-500" />
                                </div>
                                <h3 className="text-base font-medium text-gray-800">Share Your Feeling</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewQuote({ quote: "", mood: "", isAnonymous: false });
                                    setDetectedEmotion(null);
                                    setLanguageWarning("");
                                }}
                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        <div className="p-4 sm:p-5 space-y-4 pb-6 sm:pb-8">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    What's on your mind?
                                </label>
                                <textarea
                                    rows={4}
                                    value={newQuote.quote}
                                    onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })}
                                    placeholder="Write something meaningful... (AI will detect your mood automatically)"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                                />

                                {newQuote.quote.length >= 5 && (
                                    <div className="mt-2">
                                        {isDetecting ? (
                                            <div className="flex items-center gap-2 text-xs text-blue-500 bg-blue-50 p-2.5 rounded-lg">
                                                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                <span>AI is detecting your mood...</span>
                                            </div>
                                        ) : detectedEmotion && detectedConfidence > 0 ? (
                                            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2.5 rounded-lg">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                <span>
                                                    AI detected: <strong className="capitalize">{detectedEmotion} </strong>
                                                    ({detectedConfidence}% confident)
                                                    {detectedConfidence > 70 && " ✓ Auto-selected"}
                                                </span>
                                            </div>
                                        ) : languageWarning ? (
                                            <div className="flex items-start gap-2 text-xs text-red-500 bg-red-50 p-2.5 rounded-lg">
                                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                                <span>{languageWarning}</span>
                                            </div>
                                        ) : detectError ? (
                                            <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-50 p-2.5 rounded-lg">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span>{detectError}</span>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                    How are you feeling? {detectedEmotion && detectedConfidence > 70 && (
                                        <span className="text-green-500 text-[10px] ml-1">(AI suggested)</span>
                                    )}
                                </label>
                                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                    {moodOptions.filter(m => m.value !== "all").map((mood) => (
                                        <button
                                            key={mood.value}
                                            type="button"
                                            onClick={() => setNewQuote({ ...newQuote, mood: mood.value })}
                                            className={`px-3 py-1.5 rounded-full text-xs capitalize transition-all touch-manipulation ${newQuote.mood === mood.value
                                                ? "bg-blue-500 text-white"
                                                : detectedEmotion === mood.value && detectedConfidence > 70
                                                    ? "bg-green-100 text-green-700 border border-green-300"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {mood.label}
                                            {detectedEmotion === mood.value && detectedConfidence > 70 && (
                                                <Sparkles className="w-2.5 h-2.5 inline-block ml-1" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer py-1">
                                    <input
                                        type="checkbox"
                                        checked={newQuote.isAnonymous}
                                        onChange={(e) => setNewQuote({ ...newQuote, isAnonymous: e.target.checked })}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                        <EyeOff className="w-3.5 h-3.5" />
                                        Post as Anonymous
                                    </span>
                                </label>
                                <p className="text-[10px] text-gray-400 mt-1 ml-6">
                                    Your name won't be shown publicly
                                </p>
                            </div>

                            <p className="text-[10px] text-gray-400 pt-1">
                                Tip: Write at least 5 words in English for best AI detection
                            </p>
                        </div>

                        <div className="flex gap-3 p-4 sm:p-5 border-t border-gray-100 bg-gray-50/30 sticky bottom-0">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setNewQuote({ quote: "", mood: "", isAnonymous: false });
                                    setDetectedEmotion(null);
                                }}
                                className="flex-1 px-4 py-2.5 text-gray-600 bg-white rounded-xl hover:bg-gray-50 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddQuote}
                                disabled={isSubmitting || !newQuote.quote.trim() || !newQuote.mood}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Sharing...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Share</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm overflow-hidden shadow-xl">
                        <div className="p-5 sm:p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Quote?</h3>
                            <p className="text-sm text-gray-500 mb-5">
                                Are you sure you want to delete this quote? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setQuoteToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}