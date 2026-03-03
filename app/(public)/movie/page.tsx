import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MovieCard } from "@/components/movies/movie-card";
import { Hero } from "@/components/hero";
import { getMovies } from "@/lib/movies-api";

export default async function MoviesPage() {
  try {
    const response = await getMovies({ page: 1, limit: 20 });
    const movies = response?.data || [];

    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <Hero
          title="Movies"
          description="Explore all Movies"
          accentColor="rgb(139, 92, 246)"
          backgroundImage="/images/1superman.jpg"
        />

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <main className="py-8 md:py-12">
              <div className="mb-6 md:mb-8">
                <h3 className="mb-2 text-xl md:text-2xl font-semibold text-zinc-50">
                  Featured Movies
                </h3>
                <p className="text-sm text-zinc-500">
                  Handpicked cinematic masterpieces
                </p>
              </div>
              {movies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
                  {movies.map((movie, index) => (
                    <MovieCard 
                      key={movie.id || movie.slug || `movie-${index}`} 
                      movie={movie} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-zinc-400">No movies available</p>
                </div>
              )}
            </main>
          </div>
        </div>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <Hero
          title="Movies"
          description="Explore all Movies"
          accentColor="rgb(139, 92, 246)"
          backgroundImage="/images/1superman.jpg"
        />

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <main className="py-8 md:py-12">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-400 mb-2">Failed to load movies</p>
                  <p className="text-sm text-zinc-500">Please check your API connection</p>
                </div>
              </div>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}