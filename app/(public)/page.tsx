import { getMovies } from "@/lib/movies-api";
import { MovieCard } from "@/components/movies/movie-card";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { getMovies } from "@/lib/movies-api";

export default async function Home() {
  let movies = [];
  try {
    const data = await getMovies({ limit: 20 });
    movies = data?.data || [];
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }

  return (
    <div className="min-h-screen bg-linear-to-tr from-zinc-950 via-red-950/20 to-red-950">
      <Header />
      <Hero
        title="Avatar: Fire and Ash"
        description="Jake and Neytiri's family grapples with grief..."
        accentColor="rgb(220, 38, 38)"
        backgroundImage="/images/avatar.jpg"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <main className="py-8 md:py-12">
            <div className="mb-6 md:mb-8">
              <h3 className="mb-2 text-xl md:text-2xl font-semibold text-zinc-50">
                Trending
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            {movies.length === 0 && (
              <p className="text-zinc-400 text-center py-8">No movies found.</p>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default async function Home() {
  try {
    const response = await getMovies({ page: 1, limit: 20 });
    const movies = response?.data || [];

    return (
      <div className="min-h-screen bg-linear-to-tr from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <Hero
          title="Avatar: Fire and Ash"
          description="Jake and Neytiri's family grapples with grief..."
          accentColor="rgb(220, 38, 38)"
          backgroundImage="/images/avatar.jpg"
        />

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <main className="py-8 md:py-12">
              <div className="mb-6 md:mb-8">
                <h3 className="mb-2 text-xl md:text-2xl font-semibold text-zinc-50">
                  Trending
                </h3>
              </div>
              {movies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
                  {movies.map((movie, index) => (
                    <MovieCard key={movie.id || movie.slug || `movie-${index}`} movie={movie} />
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
      <div className="min-h-screen bg-linear-to-tr from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <Hero
          title="Avatar: Fire and Ash"
          description="Jake and Neytiri's family grapples with grief..."
          accentColor="rgb(220, 38, 38)"
          backgroundImage="/images/avatar.jpg"
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