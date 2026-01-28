import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Movie {
  id: string;
  title: string;
  slug: string;
  poster: string;
  backdrop?: string;
  year: number;
  rating: number;
  genre: string[];
  director: string;
  duration?: number;
  mpaaRating?: string;
  synopsis?: string;
}

// Extended mock data with additional fields
const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    slug: "the-shawshank-redemption",
    poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    year: 1994,
    rating: 9.3,
    genre: ["Drama", "Crime"],
    director: "Frank Darabont",
    duration: 142,
    mpaaRating: "R",
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  },
  {
    id: "2",
    title: "The Godfather",
    slug: "the-godfather",
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    year: 1972,
    rating: 9.2,
    genre: ["Drama", "Crime"],
    director: "Francis Ford Coppola",
    duration: 175,
    mpaaRating: "R",
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  },
];

// Mock streaming services
const STREAMING_SERVICES = [
  { name: "Netflix", available: true, logo: "🎬" },
  { name: "Prime Video", available: true, logo: "📺" },
  { name: "Disney+", available: false, logo: "🏰" },
  { name: "HBO Max", available: true, logo: "🎭" },
];

// Mock theater locations
const THEATERS = [
  { name: "AMC Downtown", address: "123 Main St", showtime: "7:30 PM" },
  { name: "Regal Cinema", address: "456 Oak Ave", showtime: "8:00 PM" },
  { name: "Cinemark Plaza", address: "789 Elm St", showtime: "9:15 PM" },
];

// Mock forum posts
const FORUM_POSTS = [
  {
    id: "1",
    author: "cinephile_92",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cinephile",
    content: "This is an absolute masterpiece! The cinematography and performances are unforgettable.",
    timestamp: "2 hours ago",
    likes: 24,
  },
  {
    id: "2",
    author: "movie_buff",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moviebuff",
    content: "One of the greatest films ever made. Still holds up after all these years.",
    timestamp: "5 hours ago",
    likes: 18,
  },
];

async function getMovie(slug: string): Promise<Movie | null> {
  // Simulate async data fetching
  await new Promise((resolve) => setTimeout(resolve, 100));
  return MOCK_MOVIES.find((movie) => movie.slug === slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovie(slug);

  if (!movie) {
    return {
      title: "Movie Not Found | CineMesh",
    };
  }

  return {
    title: `${movie.title} (${movie.year}) | CineMesh`,
    description: movie.synopsis || `Watch ${movie.title} - ${movie.genre.join(", ")}`,
  };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const movie = await getMovie(slug);

  if (!movie) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Backdrop Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
        {movie.backdrop && (
          <Image
            src={movie.backdrop}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        )}
        
        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex gap-8">
              {/* Poster */}
              <div className="hidden md:block">
                <div className="w-48 overflow-hidden rounded-lg shadow-2xl ring-1 ring-zinc-800">
                  <Image
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    width={192}
                    height={288}
                    className="aspect-[2/3] object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Title and Meta */}
              <div className="flex flex-col justify-end">
                <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
                  {movie.title}
                </h1>
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                  <span>{movie.year}</span>
                  {movie.mpaaRating && (
                    <>
                      <span>•</span>
                      <span className="rounded border border-zinc-600 px-1.5 py-0.5 text-xs">
                        {movie.mpaaRating}
                      </span>
                    </>
                  )}
                  {movie.duration && (
                    <>
                      <span>•</span>
                      <span>{movie.duration} min</span>
                    </>
                  )}
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="font-semibold text-yellow-100">
                      {movie.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-zinc-800/80 px-3 py-1 text-sm text-zinc-300 ring-1 ring-zinc-700"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-8 py-12">
        {/* Synopsis */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-white">Synopsis</h2>
          <p className="text-lg leading-relaxed text-zinc-300">
            {movie.synopsis || "No synopsis available."}
          </p>
          <p className="mt-4 text-sm text-zinc-400">
            Directed by <span className="font-medium text-zinc-300">{movie.director}</span>
          </p>
        </section>

        {/* Where to Watch Online */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-white">Stream Online</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {STREAMING_SERVICES.map((service) => (
              <div
                key={service.name}
                className={`rounded-lg p-4 text-center transition-all ${
                  service.available
                    ? "bg-zinc-800 ring-1 ring-zinc-700 hover:bg-zinc-700"
                    : "bg-zinc-900 opacity-50 ring-1 ring-zinc-800"
                }`}
              >
                <div className="mb-2 text-4xl">{service.logo}</div>
                <p className="text-sm font-medium text-zinc-100">{service.name}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {service.available ? "Available" : "Not Available"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* In Theaters */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-white">In Theaters</h2>
          <div className="space-y-3">
            {THEATERS.map((theater) => (
              <div
                key={theater.name}
                className="flex items-center justify-between rounded-lg bg-zinc-800 p-4 ring-1 ring-zinc-700 transition-all hover:bg-zinc-700"
              >
                <div>
                  <h3 className="font-medium text-zinc-100">{theater.name}</h3>
                  <p className="text-sm text-zinc-400">{theater.address}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-zinc-100">{theater.showtime}</p>
                  <button className="mt-1 rounded bg-red-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700">
                    Get Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Forum Discussion */}
        <section>
          <h2 className="mb-4 text-2xl font-semibold text-white">Discussion</h2>
          <div className="mb-6 rounded-lg bg-zinc-800 p-4 ring-1 ring-zinc-700">
            <textarea
              placeholder="Share your thoughts about this movie..."
              className="w-full resize-none rounded bg-zinc-900 p-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none ring-1 ring-zinc-700 focus:ring-zinc-600"
              rows={3}
            />
            <div className="mt-3 flex justify-end">
              <button className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700">
                Post Comment
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {FORUM_POSTS.map((post) => (
              <div
                key={post.id}
                className="rounded-lg bg-zinc-800 p-4 ring-1 ring-zinc-700"
              >
                <div className="mb-3 flex items-center gap-3">
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized
                  />
                  <div>
                    <p className="font-medium text-zinc-100">{post.author}</p>
                    <p className="text-xs text-zinc-500">{post.timestamp}</p>
                  </div>
                </div>
                <p className="mb-3 text-zinc-300">{post.content}</p>
                <div className="flex items-center gap-4 text-sm">
                  <button className="flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-100">
                    <span>👍</span>
                    <span>{post.likes}</span>
                  </button>
                  <button className="text-zinc-400 transition-colors hover:text-zinc-100">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}