// src/pages/BlogDetailPage.jsx

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import {
  Calendar,
  User,
  Clock,
  Eye,
  Heart,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Check,
  ArrowRight,
  Tag,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BlogSidebar from "@/components/blog-sidebar";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { buildStorageUrl } from "@/lib/helper";
import useQuery from "@/hooks/use-query";
import useQueryPagination from "@/hooks/use-query-pagination";

// Shimmer Loading Components
const ShimmerText = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-11/12"></div>
    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
  </div>
);

const ShimmerHeader = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
    <div className="h-10 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-10 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="flex gap-4 mb-6">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
      <div className="h-4 bg-gray-200 rounded w-28"></div>
    </div>
    <div className="h-[400px] bg-gray-200 rounded-xl mb-8"></div>
  </div>
);

const BlogDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 lg:max-w-3xl xl:max-w-4xl">
          <ShimmerHeader />
          <ShimmerText />
          <div className="mt-6">
            <ShimmerText />
          </div>
        </div>
        <div className="lg:w-80">
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-gray-200 rounded-xl"></div>
            <div className="h-60 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

// Table of Contents Component
const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.3 }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 mb-8 border border-gray-200">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between w-full"
      >
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <Menu className="w-4 h-4 text-blue-600" />
          Table of Contents
        </h3>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
      </button>
      
      {!isCollapsed && (
        <ul className="mt-3 space-y-2 text-sm">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block py-1.5 transition-all duration-300 rounded-lg px-2 ${
                  activeId === heading.id
                    ? "text-blue-600 font-medium bg-blue-50"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
                style={{ paddingLeft: `${(heading.level - 1) * 16 + 8}px` }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Share Buttons Component
const ShareButtons = ({ url, title }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowTooltip(true);
      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => window.open(shareLinks.facebook, "_blank")}
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-110"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </button>
      <button
        onClick={() => window.open(shareLinks.twitter, "_blank")}
        className="p-2 rounded-full bg-gray-100 hover:bg-sky-100 text-gray-600 hover:text-sky-500 transition-all duration-300 hover:scale-110"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </button>
      <button
        onClick={() => window.open(shareLinks.linkedin, "_blank")}
        className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-700 transition-all duration-300 hover:scale-110"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </button>
      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 hover:scale-110"
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
        </button>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
            Link copied!
          </div>
        )}
      </div>
    </div>
  );
};

// Author Bio Component
const AuthorBio = ({ author }) => {
  if (!author) return null;

  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 my-8 border border-blue-100">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {getInitials(author.name || author)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-800 text-lg">{author.name || author}</h4>
            <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">Author</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {author.bio || "Passionate reader and book enthusiast sharing insights about literature, reading culture, and the joy of discovering great stories."}
          </p>
          {author.socials && (
            <div className="flex gap-3 mt-3">
              {author.socials.twitter && (
                <a 
                  href={author.socials.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-sky-500 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Comments Section Component
const CommentsSection = ({ postId, postTitle }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${postId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      const mockComments = [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah@example.com",
          content: "This is such an insightful article! Really enjoyed reading about these reading tips. Can't wait to implement them.",
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 2,
          name: "Michael Chen",
          email: "michael@example.com",
          content: "Great content as always! The section about building a reading habit was particularly helpful.",
          date: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
      setComments(mockComments);
      localStorage.setItem(`comments_${postId}`, JSON.stringify(mockComments));
    }
  }, [postId]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !userName.trim()) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const comment = {
        id: Date.now(),
        name: userName,
        email: userEmail,
        content: newComment,
        date: new Date().toISOString(),
      };
      const updatedComments = [comment, ...comments];
      setComments(updatedComments);
      localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
      setNewComment("");
      setShowForm(false);
      setIsSubmitting(false);
    }, 500);
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="mt-10 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Comments ({comments.length})
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Write a Comment
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmitComment} className="mb-8 bg-gray-50 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Leave a Comment</h4>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name *"
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Your email (optional)"
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            required
          />
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">{comment.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{formatCommentDate(comment.date)}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-sm ml-10">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Related Posts Component
const RelatedPosts = ({ posts, loading }) => {
  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          Related Articles
        </h2>
        <Link to="/blog" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <ImageWithFallback
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-400 mb-2">{formatDate(post.published_at)}</div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                {post.title}
              </h3>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{post.excerpt || post.short_description}</p>
              <div className="mt-3 flex items-center text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Read More
                <ChevronRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Progress Bar Component
const ReadingProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const scrollPercent = (scrollTop / maxScroll) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Main Blog Detail Component
export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);
  
  const [post, setPost] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [headings, setHeadings] = useState([]);

  // Fetch single post using useQuery
  const { data: postData, loading: postLoading } = useQuery({
    url: `blog/posts/${slug}`,
    method: "GET",
    immediate: true,
  });

  // Fetch related posts using useQueryPagination
  const { 
    data: relatedPosts, 
    loading: relatedLoading 
  } = useQueryPagination({
    url: "blog/posts",
    method: "GET",
    params: {
      per_page: 3,
      exclude_slug: slug,
      ...(post?.category && { category: post.category }),
    },
    paginated: false,
    immediate: !!post?.category,
  });

  // Fetch recent posts for sidebar using useQueryPagination
  const { 
    data: recentPosts, 
    loading: recentLoading 
  } = useQueryPagination({
    url: "blog/posts",
    method: "GET",
    params: {
      per_page: 5,
      sort_by: "published_at",
      sort_direction: "desc",
    },
    paginated: false,
    immediate: true,
  });

  // Process post data when loaded
  useEffect(() => {
    if (postData && postData.data) {
      const processedPost = {
        ...postData.data,
        featured_image: postData.data.featured_image
          ? (postData.data.featured_image.startsWith('http')
              ? postData.data.featured_image
              : buildStorageUrl(postData.data.featured_image))
          : null,
        content: postData.data.content || postData.data.body || "<p>Content coming soon...</p>"
      };
      setPost(processedPost);
      setLikesCount(processedPost.likes || 0);
      
      // Check if bookmarked
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");
      setIsBookmarked(bookmarks.includes(processedPost.id));
      
      // Extract headings after content is set
      setTimeout(() => extractHeadings(processedPost.content), 100);
    }
  }, [postData]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  const extractHeadings = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const headingElements = tempDiv.querySelectorAll("h2, h3");
    const extracted = [];
    headingElements.forEach((el, index) => {
      const text = el.textContent || "";
      const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      el.id = id;
      extracted.push({
        id,
        text,
        level: parseInt(el.tagName[1]),
      });
    });
    setHeadings(extracted);
  };

  const handleBookmark = () => {
    if (!post) return;
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedPosts") || "[]");
    if (!isBookmarked) {
      bookmarks.push(post.id);
      setIsBookmarked(true);
    } else {
      const index = bookmarks.indexOf(post.id);
      if (index > -1) bookmarks.splice(index, 1);
      setIsBookmarked(false);
    }
    localStorage.setItem("bookmarkedPosts", JSON.stringify(bookmarks));
  };

  const handleLike = () => {
    if (!isLiked) {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
    } else {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Book Review": "bg-amber-100 text-amber-700",
      "Reading Tips": "bg-emerald-100 text-emerald-700",
      "Story": "bg-indigo-100 text-indigo-700",
      "Research": "bg-sky-100 text-sky-700",
      "News": "bg-rose-100 text-rose-700",
      "Interview": "bg-violet-100 text-violet-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  // Handle not found
  if (!postLoading && postData && !postData.data) {
    navigate("/blog", { replace: true });
    return null;
  }

  if (postLoading) return <BlogDetailSkeleton />;
  if (!post) return null;

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gray-50">
      <ReadingProgressBar />
      <Navbar />

      {/* Hero Section with Breadcrumb */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-10">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Link to="/" className="hover:text-white transition-colors hover:underline underline-offset-4">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/blog" className="hover:text-white transition-colors hover:underline underline-offset-4">
                Blog
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium truncate max-w-[200px] sm:max-w-md">
                {post.title}
              </span>
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span>{post.author?.name || post.author || "Admin"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.read_time || "5 min read"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post.views || 0} views</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <article className="flex-1 lg:max-w-3xl xl:max-w-4xl" ref={contentRef}>
            {/* Featured Image */}
            {post.featured_image && (
              <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                <ImageWithFallback
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Action Buttons - Bookmark & Like */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isLiked 
                      ? "bg-red-50 text-red-600 border-red-200" 
                      : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-red-600" : ""}`} />
                  <span className="text-sm font-medium">{likesCount}</span>
                </button>
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isBookmarked 
                      ? "bg-blue-50 text-blue-600 border-blue-200" 
                      : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-600" : ""}`} />
                  <span className="text-sm font-medium">
                    {isBookmarked ? "Saved" : "Save"}
                  </span>
                </button>
              </div>

              {/* Desktop Share */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-500">Share:</span>
                <ShareButtons url={currentUrl} title={post.title} />
              </div>
            </div>

            {/* Mobile Floating Share */}
            <div className="sm:hidden fixed bottom-6 right-4 z-20">
              <div className="bg-white rounded-full shadow-lg p-2 flex gap-2 border">
                <ShareButtons url={currentUrl} title={post.title} />
              </div>
            </div>

            {/* Table of Contents */}
            <TableOfContents headings={headings} />

            {/* Article Content */}
            <div 
              className="prose prose-lg prose-blue max-w-none
                prose-headings:font-bold prose-headings:text-gray-800 prose-headings:scroll-mt-24
                prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md prose-img:my-6
                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 
                prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:bg-gray-50 
                prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
                prose-ul:list-disc prose-ul:pl-5 prose-ul:my-4
                prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-4
                prose-li:text-gray-600 prose-li:my-1
                prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-xl
                first:prose-p:mt-0 last:prose-p:mb-0"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-gray-200">
                <Tag className="w-4 h-4 text-gray-400" />
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog/tag/${tag.toLowerCase().replace(/ /g, "-")}`}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Author Bio */}
            <AuthorBio author={post.author} />

            {/* Comments Section */}
            <CommentsSection postId={post.id} postTitle={post.title} />
          </article>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Sticky Share Widget - Desktop */}
            <div className="hidden lg:block sticky top-24">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  Share this article
                </h3>
                <ShareButtons url={currentUrl} title={post.title} />
              </div>
            </div>
            
            <BlogSidebar 
              onSearch={(keyword) => navigate(`/blog?q=${keyword}`)}
              recentPosts={recentPosts}
              loading={recentLoading}
            />
          </div>
        </div>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} loading={relatedLoading} />
      </div>

      <Footer />
    </div>
  );
}