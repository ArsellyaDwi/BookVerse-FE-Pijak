import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Brain, BookOpen } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import BookCard from "@/components/book-card";

import useQuery from "@/hooks/use-query";
import useMutation from "@/hooks/use-mutation";

import { buildStorageUrl } from "@/lib/helper";

const allQuestions = [
  { id: "EXT1", text: "I enjoy being the center of attention.", reverse: false },
  { id: "EXT2", text: "I feel comfortable around people.", reverse: false },
  { id: "EXT3", text: "I start conversations easily.", reverse: false },
  { id: "EXT4", text: "I talk to a lot of different people at parties.", reverse: false },

  { id: "EST1", text: "I often feel blue.", reverse: false },
  { id: "EST2", text: "I get upset easily.", reverse: false },
  { id: "EST3", text: "I worry about things.", reverse: false },
  { id: "EST4", text: "I am easily disturbed.", reverse: false },

  { id: "AGR1", text: "I feel others' emotions.", reverse: false },
  { id: "AGR2", text: "I sympathize with others' feelings.", reverse: false },
  { id: "AGR3", text: "I have a soft heart.", reverse: false },
  { id: "AGR4", text: "I take time to help others.", reverse: false },

  { id: "CSN1", text: "I am always prepared.", reverse: false },
  { id: "CSN2", text: "I pay attention to details.", reverse: false },
  { id: "CSN3", text: "I get chores done right away.", reverse: false },
  { id: "CSN4", text: "I like order and routine.", reverse: false },

  { id: "OPN1", text: "I enjoy new ideas.", reverse: false },
  { id: "OPN2", text: "I have a rich vocabulary.", reverse: false },
  { id: "OPN3", text: "I enjoy thinking about things.", reverse: false },
  { id: "OPN4", text: "I enjoy art and beauty.", reverse: false },
];

export default function PersonalityQuizPage() {
  const navigate = useNavigate();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const {
    data: personalityStatus,
    loading: statusLoading,
    refetch: refetchStatus,
  } = useQuery({
    url: "/auth/personality-status",
    guard: true,
    doingOnce: true,
    immediate: true,
    onError: (err) => {
      if (err?.response?.status === 401) {
        toast.error('You must login to access this page.')
        navigate("/");
      }
    }
  });

  const {
    mutate: savePersonality,
    loading: savingPersonality,
  } = useMutation({
    url: "/auth/personality",
    method: "POST",

    onSuccess: () => {
      toast.success("Personality analyzed successfully");
      refetchStatus();
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const handleAnswer = async (value) => {
    const question = allQuestions[currentQuestion];

    const finalValue = question.reverse ? 6 - value : value;

    const updatedAnswers = {
      ...answers,
      [question.id]: finalValue,
    };

    setAnswers(updatedAnswers);

    if (currentQuestion < allQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      await savePersonality({
        data: {
          answers: updatedAnswers,
        },
      });
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const personalityResult = personalityStatus?.personality;
  const quizFinished = personalityStatus?.has_completed || false;
  const recommendedGenres = personalityStatus?.genres || [];
  const recommendedBooks = personalityStatus?.books || [];

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

  if (quizFinished && personalityResult) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-gray-700" />
              </div>

              <h1 className="text-2xl font-light text-gray-800">
                Your Reading Personality
              </h1>

              <p className="text-gray-400 text-sm mt-2">
                Based on your quiz answers
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="space-y-4">

                  {[
                    {
                      label: "Openness",
                      value: personalityResult.openness,
                    },
                    {
                      label: "Conscientiousness",
                      value: personalityResult.conscientiousness,
                    },
                    {
                      label: "Extroversion",
                      value: personalityResult.extroversion,
                    },
                    {
                      label: "Agreeableness",
                      value: personalityResult.agreeableness,
                    },
                    {
                      label: "Neuroticism",
                      value: personalityResult.neuroticism,
                    },
                  ].map((trait) => (
                    <div key={trait.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{trait.label}</span>
                        <span>{trait.value}%</span>
                      </div>

                      <div className="h-2 bg-gray-100 rounded-full">
                        <div
                          className="h-full bg-gray-800 rounded-full"
                          style={{
                            width: `${trait.value}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-center text-sm uppercase tracking-wide text-gray-500 mb-5">
                Recommended Genres
              </h2>

              <div className="flex flex-wrap justify-center gap-3">

                {recommendedGenres.map((genre, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      navigate(`/books?genres=${genre.id}`)
                    }
                    className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    {genre.genre}
                  </button>
                ))}

              </div>
            </div>

            <div>
              <h2 className="text-center text-sm uppercase tracking-wide text-gray-500 mb-6">
                Books You Might Like
              </h2>

              {statusLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-3/4 mb-1" />
                      <div className="h-2 bg-gray-50 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : recommendedBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">

                  {recommendedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      title={book.title || "Untitled"}
                      author={
                        book.author?.split(",")[0] ||
                        book.author ||
                        "Unknown"
                      }
                      price={book.price || 0}
                      rating={book.rating || 0}
                      image={
                        book.cover_img
                          ? buildStorageUrl(book.cover_img)
                          : null
                      }
                    />
                  ))}

                </div>
              ) : (
                <div className="text-center py-10">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                  <p className="text-gray-400 text-sm">
                    No recommendations found
                  </p>
                </div>
              )}
            </div>

            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition"
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

  const progress =
    ((currentQuestion + 1) / allQuestions.length) * 100;

  const currentQ = allQuestions[currentQuestion];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white">
        <div className="max-w-xl mx-auto px-4 py-10">

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-gray-700" />
            </div>

            <h1 className="text-2xl font-light text-gray-800">
              Reading Personality
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Answer {allQuestions.length} questions
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>
                {currentQuestion + 1}/{allQuestions.length}
              </span>

              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-1 bg-gray-100 rounded-full">
              <div
                className="h-full bg-gray-800 rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {currentQ.text}
            </p>

            <div className="space-y-3">

              {[
                { value: 1, label: "Strongly Disagree" },
                { value: 2, label: "Disagree" },
                { value: 3, label: "Neutral" },
                { value: 4, label: "Agree" },
                { value: 5, label: "Strongly Agree" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  disabled={savingPersonality}
                  className="w-full py-3 px-4 text-left border border-gray-100 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  {option.label}
                </button>
              ))}

            </div>

            {currentQuestion > 0 && (
              <button
                onClick={handlePrevQuestion}
                className="mt-5 text-sm text-gray-400 hover:text-gray-700"
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