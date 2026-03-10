import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovie } from "@/lib/movies-api";

const CORE_API = process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:8080";

const STREAMING_SERVICES = [
  { name: "Netflix", available: true, logo: "N" },
  { name: "Apple TV", available: true, logo: "" },
];

const FALLBACK_POSTER = "https://placehold.co/500x750/1a1a1a/666666?text=No+Poster";
const FALLBACK_BACKDROP = "https://placehold.co/1920x1080/1a1a1a/666666?text=No+Backdrop";

async function getShowtimes(movieId: number) {
  try {
    const res = await fetch(
      `${CORE_API}/api/public/movies/${movieId}/showtimes`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const movie = await getMovie(slug);
    return {
      title: `${movie.title} (${movie.year}) | CineMesh`,
      description: movie.synopsis || `Watch ${movie.title}`,
    };
  } catch {
    return { title: "Movie Not Found | CineMesh" };
  }
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let movie;
  try {
    movie = await getMovie(slug);
  } catch {
    notFound();
  }

  const showtimes = await getShowtimes(movie.id);

  const legendMap: Record<string, string[]> = {};
  const primeMap: Record<string, string[]> = {};

  for (const s of showtimes) {
    const cinemaName = s.cinema?.name || "Unknown";
    const providerName = s.cinema?.provider?.name || "";
    const time = new Date(s.start_time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (providerName.toLowerCase().includes("legend")) {
      if (!legendMap[cinemaName]) legendMap[cinemaName] = [];
      legendMap[cinemaName].push(time);
    } else if (providerName.toLowerCase().includes("prime")) {
      if (!primeMap[cinemaName]) primeMap[cinemaName] = [];
      primeMap[cinemaName].push(time);
    }
  }

  const legendShowtimes = Object.entries(legendMap).map(([name, times]) => ({
    cinemaName: name,
    times,
  }));

  const primeShowtimes = Object.entries(primeMap).map(([name, times]) => ({
    cinemaName: name,
    times,
  }));

  const rating = movie.average_rating || 0;
  const genres = movie.genres || [];
  const cast = movie.cast || [];
  const posterUrl = movie.poster_url || FALLBACK_POSTER;
  const backdropUrl = movie.backdrop_url || FALLBACK_BACKDROP;

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      {/* Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden -mt-24">
        <Image
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">

            {/* LEFT COLUMN */}
            <div className="shrink-0 flex gap-3 md:flex-col md:gap-0 md:space-y-6">

              {/* Poster */}
              <div className="w-28 sm:w-32 md:w-64 shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 ring-zinc-800">
                <Image
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  width={256}
                  height={384}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 md:flex-none space-y-3 md:space-y-6">

                {/* Streaming */}
                <div>
                  <h3 className="text-sm md:text-lg font-semibold mb-1.5 md:mb-3 text-white">
                    Stream It Now
                  </h3>

                  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg md:rounded-xl border border-zinc-800 p-2 md:p-4 md:w-64">
                    {STREAMING_SERVICES.map((service) => (
                      <div key={service.name} className="flex items-center justify-between py-1.5 md:py-2">
                        <span className="text-xs md:text-base text-zinc-300">{service.name}</span>
                        <span className="text-red-500 font-bold text-sm md:text-lg">{service.logo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* NOW SHOWING */}
                <div>
                  <h3 className="text-sm md:text-lg font-semibold mb-1.5 md:mb-3 text-white">
                    Now Showing
                  </h3>

                  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg md:rounded-xl border border-zinc-800 p-2 md:p-4 md:w-64 space-y-3">
                    {legendShowtimes.length > 0 && (
                      <Link
                        href={`/movies/${slug}/showtimes?provider=Legend`}
                        className="block p-3 rounded-lg hover:bg-zinc-800 transition-colors group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Image
                            src="https://www.legend.com.kh/_ipx/s_117x44/legend-cinema-logo.png"
                            alt="Legend Cinema"
                            width={55}
                            height={20}
                            unoptimized
                          />
                        </div>
                        <p className="text-xs text-zinc-400 group-hover:text-zinc-300">
                          {legendShowtimes.reduce((total, cinema) => total + cinema.times.length, 0)} showtimes
                        </p>
                      </Link>
                    )}

                    {primeShowtimes.length > 0 && (
                      <Link
                        href={`/movies/${slug}/showtimes?provider=Prime`}
                        className="block p-3 rounded-lg hover:bg-zinc-800 transition-colors group border-t border-zinc-700 pt-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Image
                            src="https://primecineplex.com/Assets/exolutus/css/images/PrimeLogo.png"
                            alt="Prime Cineplex"
                            width={55}
                            height={20}
                            unoptimized
                          />
                        </div>
                        <p className="text-xs text-zinc-400 group-hover:text-zinc-300">
                          {primeShowtimes.reduce((total, cinema) => total + cinema.times.length, 0)} showtimes
                        </p>
                      </Link>
                    )}

                    {legendShowtimes.length === 0 && primeShowtimes.length === 0 && (
                      <p className="text-xs text-zinc-500">
                        No showtimes available
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 text-white">

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {movie.title}
              </h1>

              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <span>{movie.year}</span>

                {movie.mpaa_rating && (
                  <>
                    <span>•</span>
                    <span className="rounded border border-zinc-600 px-2 py-0.5 text-xs">
                      {movie.mpaa_rating}
                    </span>
                  </>
                )}

                {movie.duration_minutes && (
                  <>
                    <span>•</span>
                    <span>{movie.duration_minutes} min</span>
                  </>
                )}

                {rating > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold text-yellow-100">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full bg-zinc-800/80 px-3 py-1 text-sm text-zinc-300 ring-1 ring-zinc-700"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.synopsis && (
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
                  {movie.synopsis}
                </p>
              )}

              {movie.director && (
                <div className="mb-6">
                  <span className="text-sm text-zinc-500">Director: </span>
                  <span className="text-base text-zinc-200 font-medium">
                    {movie.director}
                  </span>
                </div>
              )}

              {/* Cast */}
              {cast.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Cast</h3>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {cast.slice(0, 12).map((castMember) => (
                      <div key={castMember.id} className="text-center">

                        <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-zinc-700">

                          {castMember.profile_path ? (
                            <Image
                              src={castMember.profile_path}
                              alt={castMember.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 text-xl font-bold">
                              {castMember.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                        </div>

                        <p className="text-sm font-medium text-zinc-200 truncate">
                          {castMember.name}
                        </p>

                        {castMember.character && (
                          <p className="text-xs text-zinc-500 truncate">
                            {castMember.character}
                          </p>
                        )}

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Reviews</h3>
                  <span className="text-sm text-zinc-500">Coming soon</span>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-8 text-center">
                  <p className="text-zinc-400">Reviews feature coming soon</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}