import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Calendar, User, Clock, Eye, Heart, Share2, Bookmark, ChevronLeft, ArrowLeft, Facebook, Twitter, Linkedin } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { fetchBlogPostBySlug, fetchBlogPosts } from "@/services/blogService";
import { ImageWithFallback } from "@/components/image-with-fallback";
import BlogCard from "@/components/BlogCard";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    loadPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const loadPost = async () => {
    setLoading(true);
    const result = await fetchBlogPostBySlug(slug);
    if (result.success && result.data) {
      setPost(result.data);
      loadRelatedPosts(result.data.category, result.data.id);
    }
    setLoading(false);
  };

  const loadRelatedPosts = async (category, currentId) => {
    const result = await fetchBlogPosts({ category, per_page: 3 });
    if (result.success) {
      const filtered = result.data.filter(p => p.id !== currentId);
      setRelatedPosts(filtered.slice(0, 3));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
            <p className="text-gray-500 mb-6">The article you're looking for doesn't exist.</p>
            <Link to="/blog" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-12 md:py-16">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80 mt-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author?.name || post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.read_time || "5 min read"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-4xl mx-auto px-4 -mt-12 mb-8">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isLiked ? "text-red-500 bg-red-50" : "text-gray-500 hover:text-red-500 hover:bg-red-50"}`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
                <span className="text-sm">Like</span>
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isBookmarked ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600" : ""}`} />
                <span className="text-sm">Save</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0} views</span>
            </div>
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed text-justify">
              {post.content || post.short_description}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.body || "<p>Full article content goes here.</p>" }} />
          </div>

          {/* Author Bio */}
          {post.author && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                  {post.author.name?.[0] || "A"}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{post.author.name || post.author}</h4>
                  <p className="text-sm text-gray-500 mt-1">{post.author.bio || "Book lover and passionate writer"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Related Articles</h2>
              <Link to="/blog" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}