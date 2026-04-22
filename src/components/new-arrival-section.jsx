import { ArrowRight } from "lucide-react";
import BookCard from "./book-card";
import { booksData } from "@/data/booksData";

export default function NewArrivalsSection() {
  const newArrivals = booksData.slice(3, 8);

  return (
    <section className="bg-white pt-8 pb-0">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#333333] font-poppins text-[28px] font-bold leading-relaxed">
            New Arrivals
          </h2>

          <button
            onClick={() => (window.location.href = "/genre/all")}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-all duration-300 font-poppins text-sm font-medium bg-none border-none cursor-pointer"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-8">
          {newArrivals.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>

        {/* Section Divider - 8pt Grid System */}
        <div className="h-px bg-gray-300 my-8 w-full" />
      </div>
    </section>
  );
}
