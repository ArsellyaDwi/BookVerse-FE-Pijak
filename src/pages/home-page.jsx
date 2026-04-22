import BestSellersSection from "@/components/best-seller-section";
import BlogJournalSection from "@/components/blog-journal-section";
import Footer from "@/components/footer";
import GenresSection from "@/components/genres-section";
import HeroSection from "@/components/hero-section";
import MerchandiseSection from "@/components/merchandise-section";
import Navbar from "@/components/navbar";
import NewArrivalsSection from "@/components/new-arrival-section";
import PromoBannerGrid from "@/components/promo-banner-grid";
import ValuePropositionBar from "@/components/value-proposition-bar";

export default function Homepage() {
  return (
    <main>
      <div className="min-h-screen font-[Poppins]">
        <Navbar />

        <HeroSection />
        <PromoBannerGrid />
        <ValuePropositionBar />
        <GenresSection />
        <BestSellersSection />
        <NewArrivalsSection />
        <MerchandiseSection />
        <BlogJournalSection />

        <Footer />
      </div>
    </main>
  );
}
