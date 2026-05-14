import { useNavigate } from "react-router";
import useQuery from "@/hooks/use-query";
import { useState, useEffect } from "react";

export default function GenresSection() {
  const navigate = useNavigate();
  const [genresWithImages, setGenresWithImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const getGenres = useQuery({
    url: "genre",
  });

  useEffect(() => {
    const fetchGenreImages = async () => {
      if (!getGenres.data || getGenres.loading) return;

      setIsLoadingImages(true);
      const genres = getGenres.data;
      
      const updatedGenres = await Promise.all(
        genres.map(async (genre) => {
          try {
            const response = await fetch(`/api/genres/${genre.slug}/books?per_page=1`);
            if (response.ok) {
              const result = await response.json();
              const firstBook = result?.data?.[0];
              return {
                ...genre,
                image: firstBook?.cover_img ? `/storage/${firstBook.cover_img}` : null,
              };
            }
            return genre;
          } catch {
            return genre;
          }
        })
      );
      
      setGenresWithImages(updatedGenres);
      setIsLoadingImages(false);
    };

    fetchGenreImages();
  }, [getGenres.data, getGenres.loading]);

  const handleGenreClick = (slug) => {
    navigate(`/genres/${slug}`);
  };

  const genres = (genresWithImages.length > 0 ? genresWithImages : getGenres.data || []).slice(0, 10);
  const isLoading = getGenres.loading || isLoadingImages;

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-[28px] font-bold text-gray-800 font-poppins text-center sm:text-left">
            Genres
          </h2>

          <button
            onClick={() => navigate("/genres/all")}
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all duration-300 font-poppins text-sm md:text-base font-medium cursor-pointer"
          >
            <span>View All</span>
            <svg
              className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1"
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

        {/* Genres Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          
          {/* Loading Skeletons */}
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="relative h-24 sm:h-28 md:h-32 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse overflow-hidden"
              />
            ))}

          {/* Genre Cards */}
          {!isLoading &&
            genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => handleGenreClick(genre.slug)}
                className="group relative h-24 sm:h-28 md:h-32 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {/* Background Image */}
                {genre.image ? (
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100" />
                )}

                {/* Overlay - Darker on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:bg-black/50 transition-all duration-300" />

                {/* Genre Name */}
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-2.5 md:p-3">
                  <span className="text-white font-poppins font-semibold text-xs sm:text-sm md:text-base line-clamp-1">
                    {genre.name}
                  </span>
                </div>

                {/* Book Count Badge */}
                {genre.book_count > 0 && (
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1">
                    <span className="text-white text-[10px] sm:text-xs font-medium">
                      {genre.book_count}
                    </span>
                  </div>
                )}
              </button>
            ))}

          {/* Empty State */}
          {!isLoading && genres.length === 0 && (
            <div className="col-span-full text-center py-8 md:py-12 text-gray-500 font-poppins text-sm md:text-base">
              No genres found.
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-6 md:my-8 w-full" />
      </div>
    </section>
  );
}