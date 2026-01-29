import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

const GENRES = [
  {
    id: "action",
    name: "Action",
    slug: "action",
    description: "High-octane thrills and explosive sequences",
    color: "from-red-600 to-orange-500",
    count: 245,
  },
  {
    id: "comedy",
    name: "Comedy",
    slug: "comedy",
    description: "Laugh-out-loud moments and witty humor",
    color: "from-yellow-500 to-amber-400",
    count: 189,
  },
  {
    id: "drama",
    name: "Drama",
    slug: "drama",
    description: "Compelling stories and emotional depth",
    color: "from-purple-600 to-pink-500",
    count: 312,
  },
  {
    id: "sci-fi",
    name: "Sci-Fi",
    slug: "sci-fi",
    description: "Futuristic worlds and advanced technology",
    color: "from-blue-600 to-cyan-500",
    count: 178,
  },
  {
    id: "thriller",
    name: "Thriller",
    slug: "thriller",
    description: "Edge-of-your-seat tension and mystery",
    color: "from-indigo-600 to-purple-500",
    count: 201,
  },
  {
    id: "romance",
    name: "Romance",
    slug: "romance",
    description: "Heartwarming love stories and emotions",
    color: "from-pink-500 to-rose-400",
    count: 167,
  },
  {
    id: "fantasy",
    name: "Fantasy",
    slug: "fantasy",
    description: "Magical realms and mythical adventures",
    color: "from-violet-600 to-purple-500",
    count: 143,
  },
  {
    id: "documentary",
    name: "Documentary",
    slug: "documentary",
    description: "Real stories and factual narratives",
    color: "from-teal-600 to-emerald-500",
    count: 98,
  },
  {
    id: "animation",
    name: "Animation",
    slug: "animation",
    description: "Animated wonders for all ages",
    color: "from-orange-500 to-yellow-400",
    count: 134,
  },
  {
    id: "adventure",
    name: "Adventure",
    slug: "adventure",
    description: "Epic journeys and daring quests",
    color: "from-emerald-600 to-teal-500",
    count: 156,
  },
    {
    id: "horror",
    name: "Horror",
    slug: "horror",
    description: "Spine-chilling scares and suspense",
    color: "from-gray-800 to-red-900",
    count: 156,
  },
];

export default function GenrePage() {
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
            {GENRES.map((genre) => (
              <Link
                key={genre.id}
                href={`/genre/${genre.slug}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:scale-105">
                  <div className={`absolute inset-0 bg-linear-to-br ${genre.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative p-6">
                    <div className="flex items-center justify-end mb-3">
                      <span className="text-xs text-zinc-500 bg-zinc-800/80 px-2 py-1 rounded-full">
                        {genre.count} titles
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {genre.name}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-2">
                      {genre.description}
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}