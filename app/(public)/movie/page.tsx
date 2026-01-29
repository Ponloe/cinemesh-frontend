import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MovieCard } from "@/components/movies/movie-card";
import { Hero } from "@/components/hero";
import { mockMovies } from "@/lib/mock-data";

export default function MoviesPage() {
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
              {mockMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
