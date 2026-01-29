import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MovieCard } from "@/components/movies/movie-card";
import { Hero } from "@/components/hero";

// Mock TV series data
const TV_SERIES = [
  {
    id: 1,
    title: "Breaking Bad",
    slug: "breaking-bad",
    year: 2008,
    genre: ["Crime", "Drama", "Thriller"],
    rating: 9.5,
    poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
    director: "Vince Gilligan",
  },
  {
    id: 2,
    title: "Stranger Things",
    slug: "stranger-things",
    year: 2016,
    genre: ["Drama", "Fantasy", "Horror"],
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    director: "The Duffer Brothers",
  },
  {
    id: 3,
    title: "The Last of Us",
    slug: "the-last-of-us",
    year: 2023,
    genre: ["Drama", "Action", "Adventure"],
    rating: 8.8,
    poster: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    director: "Craig Mazin",
  },
  {
    id: 4,
    title: "Succession",
    slug: "succession",
    year: 2018,
    genre: ["Drama"],
    rating: 8.9,
    poster: "https://image.tmdb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg",
    director: "Jesse Armstrong",
  },
  {
    id: 5,
    title: "Game of Thrones",
    slug: "game-of-thrones",
    year: 2011,
    genre: ["Drama", "Fantasy", "Adventure"],
    rating: 9.2,
    poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    director: "David Benioff",
  },
  {
    id: 7,
    title: "Severance",
    slug: "severance",
    year: 2022,
    genre: ["Drama", "Mystery", "Sci-Fi"],
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w500/lFf6LLrQjYldcZItzOkGmMMigP7.jpg",
    director: "Dan Erickson",
  },
  {
    id: 8,
    title: "The Boys",
    slug: "the-boys",
    year: 2019,
    genre: ["Action", "Comedy", "Crime"],
    rating: 8.7,
    poster: "https://image.tmdb.org/t/p/w500/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg",
    director: "Eric Kripke",
  },
];

export default function TVSeriesPage() {
  return (
    <div className="min-h-screen">
      <div
        className="absolute top-0 left-0 right-0 h-600px -z-10 opacity-30 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgb(139, 92, 246) 0%, rgba(139, 92, 246, 0.4) 40%, transparent 80%)",
        }}
      />

      <Header />

      <Hero
        title="TV Series"
        description="Explore all TV series"
        accentColor="rgb(139, 92, 246)"
        backgroundImage="/images/stranger.jpg"
      />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
            <main className="py-8 md:py-12">
            <div className="mb-6 md:mb-8">
              <h3 className="mb-2 text-xl md:text-2xl font-semibold text-zinc-50">
                Popular TV Series
              </h3>
              <p className="text-sm text-zinc-500">
                Binge-worthy shows you can&apos;t miss
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
              {TV_SERIES.map((series) => (
                <MovieCard key={series.id} movie={series} />
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
