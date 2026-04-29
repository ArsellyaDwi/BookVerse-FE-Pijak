import { useNavigate } from "react-router";
import useQuery from "@/hooks/use-query";

export default function GenresSection() {
  const navigate = useNavigate();

  const getGenres = useQuery({
    url: "genre",
  });

  const handleGenreClick = (slug) => {
    navigate(`/genres/${slug}`);
  };

  const genres = getGenres.data?.slice(0, 10) || [];

  return (
    <section className="max-w-[1440px] mx-auto px-20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#333333] font-poppins text-[28px] font-bold">
          Genres
        </h2>

        <button
          onClick={() => navigate("/genres/all")}
          className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-all duration-300 font-poppins text-sm font-medium"
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {getGenres.loading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-slate-200 animate-pulse"
            />
          ))}

        {!getGenres.loading &&
          genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre.slug)}
              className="group relative h-28 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              {genre.image ? (
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
              )}

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />

              <div className="absolute bottom-0 left-0 p-3">
                <span className="text-white font-poppins text-sm font-semibold">
                  {genre.name}
                </span>
              </div>
            </button>
          ))}

        {!getGenres.loading && genres.length === 0 && (
          <div className="col-span-full text-center py-4 text-gray-500 font-poppins text-sm">
            No genres found.
          </div>
        )}
      </div>

      <div className="h-px bg-gray-300 my-8 w-full" />
    </section>
  );
}