import { mockMovies } from "@/lib/mock-data";
import { MovieCard } from "@/components/movies/movie-card";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <Hero />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h3 className="mb-2 text-2xl font-semibold text-zinc-50">
            Featured Films
          </h3>
          <p className="text-zinc-500">
            Handpicked selections from modern cinema
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-8">
          {mockMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>

      <footer className="mt-24 border-t border-zinc-800 bg-zinc-900/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div>
              <h4 className="mb-1 text-lg font-bold text-zinc-50">CineMesh</h4>
              <p className="text-sm text-zinc-500">
                A Modern Film Discovery Experience
              </p>
            </div>
            <p className="text-sm text-zinc-600">
              © 2025 CineMesh. Mock data for demonstration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}