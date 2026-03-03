import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { getGenres } from "@/lib/genres-api";

function getGenreSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Array of gradient combinations
const gradients = [
  "from-red-600/10 to-orange-500/10 group-hover:from-red-600/20 group-hover:to-orange-500/20",
  "from-blue-600/10 to-cyan-500/10 group-hover:from-blue-600/20 group-hover:to-cyan-500/20",
  "from-purple-600/10 to-pink-500/10 group-hover:from-purple-600/20 group-hover:to-pink-500/20",
  "from-emerald-600/10 to-teal-500/10 group-hover:from-emerald-600/20 group-hover:to-teal-500/20",
  "from-yellow-600/10 to-amber-500/10 group-hover:from-yellow-600/20 group-hover:to-amber-500/20",
  "from-indigo-600/10 to-purple-500/10 group-hover:from-indigo-600/20 group-hover:to-purple-500/20",
  "from-pink-600/10 to-rose-500/10 group-hover:from-pink-600/20 group-hover:to-rose-500/20",
  "from-violet-600/10 to-fuchsia-500/10 group-hover:from-violet-600/20 group-hover:to-fuchsia-500/20",
];

function getGradient(index: number): string {
  return gradients[index % gradients.length];
}

export default async function GenrePage() {
  const genres = await getGenres();

  return (
    <div className="min-h-screen bg-linear-to-bl from-zinc-950 via-red-950/20 to-red-950">
      <Header />
      
      <section className="mt-6 md:mt-8 mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center py-12 md:py-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Browse by Genre
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
              Discover your next favorite movie or show by exploring different genres
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {genres.map((genre, index) => {
              const slug = getGenreSlug(genre.name);
              const gradient = getGradient(index);
              
              return (
                <Link
                  key={genre.id}
                  href={`/genre/${slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:scale-105 h-32 md:h-36">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all`} />
                    <div className="relative h-full flex items-center justify-center p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white text-center">
                        {genre.name}
                      </h3>
                    </div>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}