// filepath: /Users/sovannsoponloe/Documents/Github/CS491/final/cinemesh-frontend/app/(public)/upcoming/page.tsx
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MovieCard } from "@/components/movies/movie-card";
import { Hero } from "@/components/hero";
import { getUpcomingMovies } from "@/lib/movies-api";

export default async function UpcomingPage() {
  try {
    const response = await getUpcomingMovies({ page: 1, limit: 20 });
    const movies = response?.data || [];

    return (
      <div className="min-h-screen bg-linear-to-bl from-zinc-950 via-red-950/20 to-red-950">
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
                  Most anticipated releases
                </p>
              </div>
              {movies.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-5">
                  {movies.map((movie, index) => (
                    <MovieCard 
                      key={movie.id || movie.slug || `upcoming-${index}`} 
                      movie={movie} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-zinc-400">No upcoming movies available</p>
                </div>
              )}
            </main>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch upcoming movies:", error);
    return (
      <div className="min-h-screen bg-linear-to-bl from-zinc-950 via-red-950/20 to-red-950">
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
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-red-400 mb-2">Failed to load upcoming movies</p>
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