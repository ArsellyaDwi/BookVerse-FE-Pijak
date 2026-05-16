import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Brain, BookOpen } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BookCard from "@/components/book-card";
import { buildStorageUrl } from "@/lib/helper";
import useQuery from "@/hooks/use-query";
import useMutation from "@/hooks/use-mutation";

const allQuestions = [
  { id: "EXT1", text: "I enjoy being the center of attention.", trait: "extroversion", reverse: false },
  { id: "EXT2", text: "I feel comfortable around people.", trait: "extroversion", reverse: false },
  { id: "EXT3", text: "I start conversations easily.", trait: "extroversion", reverse: false },
  { id: "EXT4", text: "I talk to a lot of different people at parties.", trait: "extroversion", reverse: false },
  { id: "EXT5", text: "I don't mind being the center of attention.", trait: "extroversion", reverse: false },
  { id: "EXT6", text: "I prefer to be alone rather than with a crowd.", trait: "extroversion", reverse: true },
  { id: "EXT7", text: "I avoid being the center of attention.", trait: "extroversion", reverse: true },
  { id: "EXT8", text: "I prefer quiet activities over social events.", trait: "extroversion", reverse: true },
  { id: "EXT9", text: "I find it hard to start a conversation.", trait: "extroversion", reverse: true },
  { id: "EXT10", text: "I feel drained after social gatherings.", trait: "extroversion", reverse: true },
  { id: "EST1", text: "I often feel blue.", trait: "neuroticism", reverse: false },
  { id: "EST2", text: "I get upset easily.", trait: "neuroticism", reverse: false },
  { id: "EST3", text: "I worry about things.", trait: "neuroticism", reverse: false },
  { id: "EST4", text: "I am easily disturbed.", trait: "neuroticism", reverse: false },
  { id: "EST5", text: "I change my mood a lot.", trait: "neuroticism", reverse: false },
  { id: "EST6", text: "I seldom feel blue.", trait: "neuroticism", reverse: true },
  { id: "EST7", text: "I am not easily bothered by things.", trait: "neuroticism", reverse: true },
  { id: "EST8", text: "I am relaxed most of the time.", trait: "neuroticism", reverse: true },
  { id: "EST9", text: "I rarely feel anxious.", trait: "neuroticism", reverse: true },
  { id: "EST10", text: "I keep my cool under pressure.", trait: "neuroticism", reverse: true },
  { id: "AGR1", text: "I feel others' emotions.", trait: "agreeableness", reverse: false },
  { id: "AGR2", text: "I sympathize with others' feelings.", trait: "agreeableness", reverse: false },
  { id: "AGR3", text: "I have a soft heart.", trait: "agreeableness", reverse: false },
  { id: "AGR4", text: "I take time to help others.", trait: "agreeableness", reverse: false },
  { id: "AGR5", text: "I make people feel at ease.", trait: "agreeableness", reverse: false },
  { id: "AGR6", text: "I am not interested in others' problems.", trait: "agreeableness", reverse: true },
  { id: "AGR7", text: "I tend to find fault with others.", trait: "agreeableness", reverse: true },
  { id: "AGR8", text: "I look down on others.", trait: "agreeableness", reverse: true },
  { id: "AGR9", text: "I insult people.", trait: "agreeableness", reverse: true },
  { id: "AGR10", text: "I believe people have bad intentions.", trait: "agreeableness", reverse: true },
  { id: "CSN1", text: "I am always prepared.", trait: "conscientiousness", reverse: false },
  { id: "CSN2", text: "I pay attention to details.", trait: "conscientiousness", reverse: false },
  { id: "CSN3", text: "I get chores done right away.", trait: "conscientiousness", reverse: false },
  { id: "CSN4", text: "I like order and routine.", trait: "conscientiousness", reverse: false },
  { id: "CSN5", text: "I follow through with my plans.", trait: "conscientiousness", reverse: false },
  { id: "CSN6", text: "I often forget to put things back.", trait: "conscientiousness", reverse: true },
  { id: "CSN7", text: "I leave my belongings around.", trait: "conscientiousness", reverse: true },
  { id: "CSN8", text: "I make a mess of things.", trait: "conscientiousness", reverse: true },
  { id: "CSN9", text: "I avoid my duties.", trait: "conscientiousness", reverse: true },
  { id: "CSN10", text: "I need a push to get started.", trait: "conscientiousness", reverse: true },
  { id: "OPN1", text: "I enjoy new ideas.", trait: "openness", reverse: false },
  { id: "OPN2", text: "I have a rich vocabulary.", trait: "openness", reverse: false },
  { id: "OPN3", text: "I enjoy thinking about things.", trait: "openness", reverse: false },
  { id: "OPN4", text: "I enjoy art and beauty.", trait: "openness", reverse: false },
  { id: "OPN5", text: "I prefer variety to routine.", trait: "openness", reverse: false },
  { id: "OPN6", text: "I avoid philosophical discussions.", trait: "openness", reverse: true },
  { id: "OPN7", text: "I have difficulty understanding abstract ideas.", trait: "openness", reverse: true },
  { id: "OPN8", text: "I am not interested in art.", trait: "openness", reverse: true },
  { id: "OPN9", text: "I prefer familiar things.", trait: "openness", reverse: true },
  { id: "OPN10", text: "I avoid change.", trait: "openness", reverse: true },
];

const getRandomQuestions = () => {
  const traits = ["extroversion", "neuroticism", "agreeableness", "conscientiousness", "openness"];
  const selectedQuestions = [];
  traits.forEach(trait => {
    const traitQuestions = allQuestions.filter(q => q.trait === trait);
    const shuffled = [...traitQuestions].sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, 4));
  });
  return selectedQuestions.sort(() => 0.5 - Math.random());
};

export default function PersonalityQuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [genreRecs, setGenreRecs] = useState([]);

  const { data: booksData, loading: loadingBooks, refetch: fetchBooks } = useQuery({
    url: "/books",
    immediate: false,
  });


  const { data: personalityStatus, loading: statusLoading, refetch: refetchStatus } = useQuery({
    url: "auth/personality-status",
    guard: true,
    onSuccess: (data) => {
      setGenreRecs(data.genres);
      const topGenre = data.genres[0]?.genre;
      if (topGenre) {
        fetchBooks({ params: { genres: topGenre, per_page: 8 } });
      } else {
        fetchBooks({ url: "/books/bestsellers", params: { limit: 8 } });
      }
    }
  });


  const { mutate: predictPersonality, loading: predicting } = useMutation({
    url: "/auth/personality",
    method: "POST",
    onSuccess: (data) => {
      setResult(data);
      refetchStatus();
      toast.success("Personality analysis complete!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });


  useEffect(() => {
    if (personalityStatus?.has_completed && personalityStatus?.personality && !quizFinished) {
      setResult(personalityStatus.personality);
      setQuizFinished(true);
    }
  }, [personalityStatus, quizFinished]);

  useEffect(() => {
    if (!statusLoading && personalityStatus && !personalityStatus.has_completed && questions.length === 0 && !quizFinished) {
      setQuestions(getRandomQuestions());
    }
  }, [statusLoading, personalityStatus, questions.length, quizFinished]);

  const handleAnswer = async (value) => {
    if (questions.length === 0) return;
    const question = questions[currentQuestion];
    let finalValue = question.reverse ? 6 - value : value;
    const newAnswers = { ...answers, [question.id]: finalValue };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      await predictPersonality({ data: { answers: newAnswers } });
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const recommendedBooks = booksData?.data?.data || booksData?.data || [];

  if (statusLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  if (quizFinished && result) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-gray-700" />
              </div>
              <h1 className="text-xl sm:text-2xl font-light text-gray-800 mb-2">Your Reading Personality</h1>
              <p className="text-gray-400 text-sm">Based on your answers</p>
            </div>

            <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="space-y-4">
                  {[
                    { label: "Openness", value: result.openness },
                    { label: "Conscientiousness", value: result.conscientiousness },
                    { label: "Extroversion", value: result.extroversion },
                    { label: "Agreeableness", value: result.agreeableness },
                    { label: "Neuroticism", value: result.neuroticism }
                  ].map((trait) => (
                    <div key={trait.label}>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{trait.label}</span>
                        <span>{trait.value}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full">
                        <div className="h-full bg-gray-800 rounded-full" style={{ width: `${trait.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-10 sm:mb-12">
              <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-4 text-center">Recommended Genres</h2>
              <div className="flex flex-wrap justify-center gap-2">
                {genreRecs.slice(0, 5).map((genre, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(`/books?genres=${genre.genre}`)}
                    className="px-4 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {genre.genre}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-5 text-center">Books You Might Like</h2>
              {loadingBooks ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-100 rounded-lg aspect-[3/4] mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
                      <div className="h-2 bg-gray-50 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : recommendedBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                  {recommendedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title || "Untitled"}
                      author={book.author?.split(',')[0] || book.author || "Unknown"}
                      price={book.price || 0}
                      rating={book.rating || 0}
                      image={book.cover_img ? buildStorageUrl(book.cover_img) : null}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No recommendations available</p>
                </div>
              )}
            </div>

            <div className="text-center mt-10 sm:mt-12">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-gray-700" />
            </div>
            <h1 className="text-xl font-light text-gray-800 mb-1">Reading Personality</h1>
            <p className="text-gray-400 text-xs">Answer {questions.length} questions</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{currentQuestion + 1}/{questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-0.5 bg-gray-100 rounded-full">
              <div className="h-full bg-gray-800 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              {currentQ.text}
            </p>

            <div className="space-y-2">
              {[
                { value: 1, label: "Strongly Disagree" },
                { value: 2, label: "Disagree" },
                { value: 3, label: "Neutral" },
                { value: 4, label: "Agree" },
                { value: 5, label: "Strongly Agree" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full py-2.5 text-left text-sm text-gray-600 border-b border-gray-50 hover:text-gray-900 hover:border-gray-200 transition-all"
                >
                  {option.label}
                </button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <button
                onClick={handlePrevQuestion}
                className="mt-5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Previous
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}