import { useState } from 'react';
import { Heart, Share2, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import quoteService from '@/services/quote-service';

export default function QuoteCard({ quote, isSaved: initialSaved = false, onSaveToggle }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) {
      toast.error('Please login to save quotes');
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        const result = await quoteService.unsaveQuote(quote.id);
        if (result.success) {
          setIsSaved(false);
          toast.success('Quote removed from saved');
          onSaveToggle?.(quote.id, false);
        }
      } else {
        const result = await quoteService.saveQuote(quote.id);
        if (result.success) {
          setIsSaved(true);
          toast.success('Quote saved to collection!');
          onSaveToggle?.(quote.id, true);
        }
      }
    } catch (error) {
      toast.error('Failed to save quote');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    const shareText = `"${quote.quote}" — ${quote.book?.title || 'Book'}`;
    if (navigator.share) {
      navigator.share({
        title: 'Book Quote',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Quote copied to clipboard!');
    }
  };

  const getMoodBadgeColor = (mood) => {
    const colors = {
      hope: 'bg-teal-100 text-teal-700',
      love: 'bg-pink-100 text-pink-700',
      courage: 'bg-purple-100 text-purple-700',
      fear: 'bg-orange-100 text-orange-700',
      anger: 'bg-red-100 text-red-700',
      sadness: 'bg-blue-100 text-blue-700',
      excitement: 'bg-amber-100 text-amber-700',
      happiness: 'bg-green-100 text-green-700',
      wisdom: 'bg-emerald-100 text-emerald-700',
      default: 'bg-gray-100 text-gray-700'
    };
    return colors[mood?.toLowerCase()] || colors.default;
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {/* Header with Mood Badge */}
      {quote.mood && (
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMoodBadgeColor(quote.mood)}`}>
            <span className="capitalize">{quote.mood}</span> vibe
          </span>
        </div>
      )}

      {/* Quote Text */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed italic text-base md:text-lg">
          "{quote.quote}"
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-medium text-gray-700">
            — {quote.book?.title || 'Unknown Book'}
          </p>
          {quote.book?.author && (
            <p className="text-xs text-gray-400">{quote.book.author}</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`p-2 rounded-full transition-all ${
              isSaved 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save quote'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-all"
            title="Share quote"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {quote.book_id && (
            <a
              href={`/books/${quote.book_id}`}
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-all"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden sm:inline">Read</span>
              <ChevronRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}