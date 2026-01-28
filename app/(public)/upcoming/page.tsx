import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MovieCard } from "@/components/movies/movie-card";
import { Hero } from "@/components/hero";

const UPCOMING_MOVIES = [
  {
    id: 1,
    title: "Dune: Part Three",
    slug: "dune-3",
    year: 2026,
    genre: ["Sci-Fi", "Adventure", "Drama"],
    rating: 0,
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    director: "Denis Villeneuve",
  },
  {
    id: 2,
    title: "Avatar 3",
    slug: "avatar-3",
    year: 2025,
    genre: ["Action", "Adventure", "Fantasy"],
    rating: 0,
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    director: "James Cameron",
  },
  {
    id: 3,
    title: "Superman: Legacy",
    slug: "superman-legacy",
    year: 2025,
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 0,
    poster: "https://image.tmdb.org/t/p/w500/4OTYefcAlaShn6TGVK33UxLW9R7.jpg",
    director: "James Gunn",
  },
  {
    id: 4,
    title: "Mission: Impossible 8",
    slug: "mission-impossible-8",
    year: 2025,
    genre: ["Action", "Thriller", "Adventure"],
    rating: 0,
    poster: "https://image.tmdb.org/t/p/original/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg",
    director: "Christopher McQuarrie",
  },
];

export default function UpcomingPage() {
  return (
    <div className="min-h-screen ">
      <Header />
      <Hero
        title="Upcoming"
        description="Explore all the upcoming"
        accentColor="rgb(139, 92, 246)"
        backgroundImage="/images/odyssey'.jpg"
      />
      
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <main className="py-8 md:py-12">
            <div className="mb-6 md:mb-8">
              <h3 className="mb-2 text-xl md:text-2xl font-semibold text-zinc-50">
                Coming Soon
              </h3>
              <p className="text-sm text-zinc-500">
                Most anticipated releases of 2025-2026
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
              {UPCOMING_MOVIES.map((movie) => (
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