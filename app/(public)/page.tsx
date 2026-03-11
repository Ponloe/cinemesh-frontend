import { MovieCard } from "@/components/movies/movie-card";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { getMovies } from "@/lib/movies-api";
import type { Movie } from "@/lib/movies-api";

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const ICT_OFFSET_MS = 7 * 60 * 60 * 1000;

function getTodayIctDateString(): string {
  const nowUTC = new Date();
  const nowICT = new Date(nowUTC.getTime() + ICT_OFFSET_MS);
  return nowICT.toISOString().split("T")[0];
}

async function hasShowtimesToday(movieId: number, todayStr: string): Promise<boolean> {
  try {
    if (!PUBLIC_API_URL) return false;

    const res = await fetch(`${PUBLIC_API_URL}/movies/${movieId}/showtimes`, {
      next: { revalidate: 120 },
    });

    if (!res.ok) return false;

    const data = await res.json();
    const showtimes = data.data || data.Data || [];

    return showtimes.some((showtime: { start_time: string }) => {
      const startUTC = new Date(showtime.start_time);
      const startICT = new Date(startUTC.getTime() + ICT_OFFSET_MS);
      return startICT.toISOString().split("T")[0] === todayStr;
    });
  } catch {
    return false;
  }
}

function renderMovieSection({
  title,
  movies,
  emptyText,
  keyPrefix,
}: {
  title: string;
  movies: Movie[];
  emptyText: string;
  keyPrefix: string;
}) {
  return (
    <section className="mb-8 md:mb-10 last:mb-0">
      {title ? (
        <div className="mb-4 md:mb-5">
          <h3 className="mb-2 text-xl md:text-2xl font-semibold text-zinc-50">
            {title}
          </h3>
        </div>
      ) : null}

      {movies.length > 0 ? (
        movies.length > 4 ? (
          <div className="flex gap-4 overflow-x-auto pb-2 lg:gap-5">
            {movies.map((movie, index) => (
              <div
                key={movie.id || movie.slug || `${keyPrefix}-${index}`}
                className="w-36 shrink-0 sm:w-40 md:w-44"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id || movie.slug || `${keyPrefix}-${index}`}
                movie={movie}
              />
            ))}
          </div>
        )
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-zinc-400">{emptyText}</p>
        </div>
      )}
    </section>
  );
}

export default async function Home() {
  try {
    const response = await getMovies({ page: 1, limit: 20 });
    const movies = response?.data || [];
    const todayStr = getTodayIctDateString();

    const moviesWithAvailability = await Promise.all(
      movies.map(async (movie) => ({
        movie,
        availableAtTheater: await hasShowtimesToday(movie.id, todayStr),
      })),
    );

    const availableAtTheaterMovies = moviesWithAvailability
      .filter((item) => item.availableAtTheater)
      .map((item) => item.movie)
      .sort((first, second) => (second.average_rating || 0) - (first.average_rating || 0));

    const trendyMovies = movies
      .filter((movie) => (movie.average_rating || 0) > 7)
      .sort((first, second) => (second.average_rating || 0) - (first.average_rating || 0));

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
            <main className="py-9 md:py-12">
              {renderMovieSection({
                title: "Available at Theater",
                movies: availableAtTheaterMovies,
                emptyText: "No movies currently available in theaters",
                keyPrefix: "movie",
              })}

              {renderMovieSection({
                title: "Trendy",
                movies: trendyMovies,
                emptyText: "No trendy movies above 8 rating",
                keyPrefix: "trendy-movie",
              })}
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