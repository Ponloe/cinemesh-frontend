import { mockMovies } from "@/lib/mock-data";
import { MovieCard } from "@/components/movies/movie-card";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero accentColor="rgb(220, 38, 38)" />

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <main className="py-8 md:py-12">
            <div className="mb-6 md:mb-8">
              <h3 className="mb-2 text-xl md:text-2xl font-semibold text-zinc-50">
                Trending
              </h3>
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
