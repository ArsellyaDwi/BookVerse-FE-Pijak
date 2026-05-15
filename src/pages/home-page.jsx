import BestSellersSection from "@/components/best-seller-section";
import Footer from "@/components/footer";
import GenresSection from "@/components/genres-section";
import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import ValuePropositionBar from "@/components/value-proposition-bar";
import CommunityQuotesSection from "@/components/community-quotes-section";
import QuizRedirectHandler from "@/components/quiz-redirect-handler";

export default function Homepage() {
  return (
    <QuizRedirectHandler>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <HeroSection />
        <ValuePropositionBar />
        <CommunityQuotesSection />
        <GenresSection />
        <BestSellersSection />
        <Footer />
      </main>
    </QuizRedirectHandler>
  );
}