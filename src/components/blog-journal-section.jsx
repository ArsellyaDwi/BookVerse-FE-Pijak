// src/components/BlogJournalSection.jsx (alternatif dengan useQuery)

import { Link } from "react-router";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";
import useQuery from "@/hooks/use-query";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

const JournalSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-2xl aspect-video mb-4"></div>
    <div className="space-y-2">
      <div className="flex gap-3">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  </div>
);

export default function BlogJournalSection() {
  // Fetch blog posts dengan useQuery
  const { data, loading } = useQuery({
    url: "blog/posts",
    method: "GET",
    params: {
      per_page: 3,
      sort_by: "published_at",
      sort_direction: "desc",
    },
    immediate: true,
  });

  // Extract posts dari response
  const posts = data?.data || data?.posts || [];
  const totalItems = data?.pagination?.total || data?.total || posts.length;

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <JournalSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              BookVerse Journal
            </h2>
            <p className="text-gray-500 mt-1">
              Latest articles and insights from our team
            </p>
          </div>
          <Link
            to="/blog"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden aspect-video">
                <ImageWithFallback
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.read_time || "5 min read"}</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {post.short_description || post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  <span className="text-sm font-medium">Read More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalItems > 3 && (
          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm"
            >
              <span>View all {totalItems} articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}