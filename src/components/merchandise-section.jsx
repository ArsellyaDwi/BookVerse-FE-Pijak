import { ArrowRight } from "lucide-react";
import MerchandiseCard from "./merchandise-card";

const merchandiseData = [
  {
    id: 101,
    name: "BookVerse Premium T-Shirt",
    price: 150000,
    image:
      "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1vY2t1cCUyMGFwcGFyZWx8ZW58MXx8fHwxNzc1MjExOTU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Apparel",
  },
  {
    id: 102,
    name: "Canvas Tote Bag",
    price: 120000,
    image:
      "https://images.unsplash.com/photo-1772890753145-089cd7618a8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW52YXMlMjB0b3RlJTIwYmFnJTIwc2hvcHBpbmd8ZW58MXx8fHwxNzc1MjExOTU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Bags",
  },
  {
    id: 103,
    name: "Baseball Cap",
    price: 100000,
    image:
      "https://images.unsplash.com/photo-1606483956061-46a898dce538?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMGNhcCUyMGhhdCUyMGZhc2hpb258ZW58MXx8fHwxNzc1MjExOTU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Accessories",
  },
  {
    id: 104,
    name: "Ceramic Mug",
    price: 85000,
    image:
      "https://images.unsplash.com/photo-1640038382256-7db69d81cb7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwY29mZmVlJTIwbXVnJTIwd2hpdGV8ZW58MXx8fHwxNzc1MjExOTU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Drinkware",
  },
  {
    id: 105,
    name: "A5 Notebook",
    price: 75000,
    image:
      "https://images.unsplash.com/photo-1621866271250-9dc9780cfc1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3RlYm9vayUyMGpvdXJuYWwlMjBzdGF0aW9uZXJ5fGVufDF8fHx8MTc3NTIxMTk1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Stationery",
  },
];

export default function MerchandiseSection() {
  return (
    <section className="bg-white pt-8 pb-0">
      <div className="max-w-[1440px] mx-auto px-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#333333] font-poppins text-[28px] font-bold leading-relaxed">
            Merchandise
          </h2>

          <button
            onClick={() => (window.location.href = "/genre/merchandise")}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-all duration-300 font-poppins text-sm font-medium bg-none border-none cursor-pointer"
          >
            View All
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-8">
          {merchandiseData.map((item) => (
            <MerchandiseCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>

        {/* Section Divider - 8pt Grid System */}
        <div className="h-px bg-gray-300 my-8 w-full" />
      </div>
    </section>
  );
}
