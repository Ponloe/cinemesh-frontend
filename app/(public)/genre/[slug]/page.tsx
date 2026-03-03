import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getMovies } from "@/lib/movies-api";
import { MovieCard } from "@/components/movies/movie-card";
import { notFound } from "next/navigation";

export default async function GenreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const genreName = slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  try {
    const { data: movies } = await getMovies({ genre: genreName, limit: 50 });

    return (
      <div className="min-h-screen bg-linear-to-bl from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        
        <section className="mt-6 md:mt-8 mb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto py-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {genreName}
              </h1>
              <p className="text-zinc-400 text-lg">
                {movies.length} movies found
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  } catch (error) {
    notFound();
  }
}