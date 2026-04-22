import { Link } from "react-router";
import { ImageWithFallback } from "./image-with-fallback";

const genres = [
  {
    name: "Romance",
    slug: "romance",
    image:
      "https://images.unsplash.com/photo-1735805819333-19bed84b654e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwbm92ZWwlMjBib29rfGVufDF8fHx8MTc3NTEzMzgwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Fantasy",
    slug: "fantasy",
    image:
      "https://images.unsplash.com/photo-1772389634170-481480aa05b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYWR2ZW50dXJlJTIwYm9va3xlbnwxfHx8fDE3NzUwODAzOTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Mystery",
    slug: "mystery",
    image:
      "https://images.unsplash.com/photo-1698956483970-a47edef29331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rfGVufDF8fHx8MTc3NTA0NjMzMXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "History",
    slug: "history",
    image:
      "https://images.unsplash.com/photo-1767596657164-1ec901bf24f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXJkY292ZXIlMjBmaWN0aW9uJTIwYm9va3xlbnwxfHx8fDE3NzUxMzM4MDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Self Development",
    slug: "self-development",
    image:
      "https://images.unsplash.com/photo-1772380407481-81b8f13bd010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbGl0ZXJhdHVyZSUyMGJvb2t8ZW58MXx8fHwxNzc1MDQ4ODM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    name: "Comics",
    slug: "comics",
    image:
      "https://images.unsplash.com/photo-1767050401645-5fe0eebc0289?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlcmJhY2slMjBub3ZlbCUyMHN0YWNtfGVufDF8fHx8MTc3NTEzMzgwNXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export default function GenresSection() {
  const handleGenreClick = (slug) => {
    window.location.href = `/genres/${slug}`;
  };

  return (
    <section className="max-w-[1440px] mx-auto px-20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#333333] font-poppins text-[28px] font-bold leading-relaxed">
          Bestselling Genres
        </h2>

        <button
          onClick={() => (window.location.href = "/genre/all")}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-all duration-300 font-poppins text-sm font-medium bg-none border-none cursor-pointer"
        >
          View All
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-6 gap-8">
        {genres.map((genre) => (
          <button
            key={genre.slug}
            onClick={() => handleGenreClick(genre.slug)}
            className="group cursor-pointer relative overflow-hidden aspect-[3/2] rounded-xl shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 border-none p-0 bg-transparent"
          >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <ImageWithFallback
                src={genre.image}
                alt={genre.name}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </div>

            {/* Gradient Overlay with Hover Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            {/* Hover Border Highlight */}
            <div className="absolute inset-0 rounded-xl border-2 border-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Genre Name - Bottom Left */}
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-white font-poppins text-base font-semibold leading-relaxed text-left transition-colors duration-300 group-hover:text-blue-100">
                {genre.name}
              </h3>
            </div>
          </button>
        ))}
      </div>

      {/* Section Divider - 8pt Grid System */}
      <div className="h-px bg-gray-300 my-8 w-full" />
    </section>
  );
}
