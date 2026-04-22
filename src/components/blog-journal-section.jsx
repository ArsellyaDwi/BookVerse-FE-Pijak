import { ArrowRight, Calendar, User } from "lucide-react";
import { ImageWithFallback } from "./image-with-fallback";

// DUMMY DATA - Ready to be replaced with Laravel database
const blogPosts = [
  {
    id: 1,
    title: "5 Self-Development Book Recommendations for Students",
    slug: "5-self-development-book-recommendations-students",
    category: "Book Review",
    short_description:
      "Discover the best self-development book collection that you must read to increase productivity and positive mindset.",
    featured_image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    author: "BookVerse Admin",
    published_at: "2026-04-01",
  },
  {
    id: 2,
    title: "Tips for Choosing the Right Book Based on Your Interests and Goals",
    slug: "tips-choosing-right-book-based-interests-goals",
    category: "Reading Tips",
    short_description:
      "A practical guide to choose books that match your interests, needs, and reading goals so you don't make the wrong choice.",
    featured_image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    author: "BookVerse Admin",
    published_at: "2026-03-28",
  },
  {
    id: 3,
    title: "Inspiring Story: How Reading Changed My Life",
    slug: "inspiring-story-reading-changed-my-life",
    category: "Story",
    short_description:
      "A real story from a BookVerse reader who experienced life transformation through the habit of reading books every day.",
    featured_image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    author: "BookVerse Admin",
    published_at: "2026-03-25",
  },
];

// Format date to English format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export default function BlogJournalSection() {
  return (
    <section className="bg-white pt-8 pb-0">
      <div className="max-w-[1440px] mx-auto px-20">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#333333] font-poppins text-[32px] font-bold leading-relaxed">
            BookVerse Journal
          </h2>

          <button
            onClick={() => (window.location.href = "/blog")}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-all duration-300 font-poppins text-sm font-medium bg-none border-none cursor-pointer"
          >
            View All Articles
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Blog Grid - 3 Columns */}
        <div className="grid grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-1"
              onClick={() => (window.location.href = `/blog/${post.slug}`)}
            >
              {/* Featured Image */}
              <div className="relative bg-gray-50 overflow-hidden aspect-video w-full">
                <ImageWithFallback
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Category Tag - Capsule Style */}
                <div className="inline-block font-poppins text-[11px] font-medium text-blue-600 border border-gray-300 rounded-full px-3 py-1 mb-3 uppercase tracking-wide">
                  {post.category}
                </div>

                {/* Article Title */}
                <h3 className="font-poppins text-lg font-semibold leading-tight text-gray-800 mb-3 min-h-[50px] line-clamp-2 hover:text-blue-600 transition-colors duration-300">
                  {post.title}
                </h3>

                {/* Short Description */}
                <p className="font-poppins text-sm font-normal leading-relaxed text-gray-500 mb-4 line-clamp-2">
                  {post.short_description}
                </p>

                {/* Meta Information */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-poppins text-xs font-normal text-gray-400">
                      {post.author}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-poppins text-xs font-normal text-gray-400">
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Section Divider - 8pt Grid System */}
        <div className="h-px bg-gray-300 my-8 w-full" />
      </div>
    </section>
  );
}
