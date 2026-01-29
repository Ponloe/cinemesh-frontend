import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { mockMovies } from "@/lib/mock-data";

const MOVIE_DETAILS: Record<
  string,
  {
    backdrop?: string;
    duration?: number;
    mpaaRating?: string;
    synopsis?: string;
    accentColor?: string;
  }
> = {
  "blade-runner-2049": {
    backdrop:
      "https://image.tmdb.org/t/p/original/ilRyazdMJwN05exqhwK4tMKBYZs.jpg",
    duration: 164,
    mpaaRating: "R",
    synopsis:
      "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
    accentColor: "255, 140, 0", 
  },
  "the-grand-budapest-hotel": {
    backdrop:
      "https://image.tmdb.org/t/p/original/u8m7yZos0NNBHnJE00PixgYK2yz.jpg",
    duration: 99,
    mpaaRating: "R",
    synopsis:
      "The adventures of Gustave H, a legendary concierge at a famous hotel from the fictional Republic of Zubrowka between the first and second World Wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.",
    accentColor: "255, 105, 180", 
  },
  parasite: {
    backdrop:
      "https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg",
    duration: 132,
    mpaaRating: "R",
    synopsis:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    accentColor: "50, 150, 100", 
  },
  "mad-max-fury-road": {
    backdrop:
      "https://image.tmdb.org/t/p/original/l0eIS009XtEO80aC6zjM3o3AkEl.jpg",
    duration: 120,
    mpaaRating: "R",
    synopsis:
      "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
    accentColor: "255, 100, 50", 
  },
  interstellar: {
    backdrop:
      "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    duration: 169,
    mpaaRating: "PG-13",
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    accentColor: "70, 130, 180", 
  },
  "the-lighthouse": {
    backdrop:
      "https://image.tmdb.org/t/p/original/tNE9HGcFOH8EpCmzO7XCYwqguI0.jpg",
    duration: 109,
    mpaaRating: "R",
    synopsis:
      "Two lighthouse keepers try to maintain their sanity while living on a remote and mysterious New England island in the 1890s.",
    accentColor: "80, 80, 100", 
  },
  moonlight: {
    backdrop:
      "https://image.tmdb.org/t/p/original/A9KPbYTQvWsp51Lgz85ukVkFrKf.jpg",
    duration: 111,
    mpaaRating: "R",
    synopsis:
      "A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.",
    accentColor: "100, 150, 200",
  },
  arrival: {
    backdrop:
      "https://image.tmdb.org/t/p/original/r8FD6CC3GgjWaGVkZh00AcedfpA.jpg",
    duration: 116,
    mpaaRating: "PG-13",
    synopsis:
      "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecrafts appear around the world.",
    accentColor: "150, 120, 100",
  },
  whiplash: {
    backdrop:
      "https://image.tmdb.org/t/p/original/1kuYEvLkX2nTkbfzN6X0w0xQFQU.jpg",
    duration: 106,
    mpaaRating: "R",
    synopsis:
      "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.",
    accentColor: "200, 150, 50",
  },
  her: {
    backdrop:
      "https://image.tmdb.org/t/p/original/sPPsR9f4K0movWVQ99u4uMqFzEL.jpg",
    duration: 126,
    mpaaRating: "R",
    synopsis:
      "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    accentColor: "255, 120, 150", 
  },
};

// Mock streaming services
const STREAMING_SERVICES = [
  { name: "Netflix", available: true, logo: "N" },
  { name: "Apple TV", available: true, logo: "" },
];

// Mock theater locations
const THEATERS = [
  { name: "Legend Cinema", logo: "🎬" },
  { name: "Prime Cineplex", logo: "🎭" },
];

async function getMovie(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const baseMovie = mockMovies.find((movie) => movie.slug === slug);
  if (!baseMovie) return null;

  const details = MOVIE_DETAILS[slug] || {};
  return { ...baseMovie, ...details };
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
    description:
      movie.synopsis || `Watch ${movie.title} - ${movie.genre.join(", ")}`,
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
      <Header />
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden -mt-24">
        {movie.backdrop && (
          <>
            <Image
              src={movie.backdrop}
              alt={`${movie.title} backdrop`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/40 to-zinc-950" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="shrink-0 space-y-6">
              <div className="w-48 md:w-64 overflow-hidden rounded-xl shadow-2xl ring-1 ring-zinc-800">
                <Image
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  width={256}
                  height={384}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Stream It Now
                </h3>
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-4 w-48 md:w-64">
                  {STREAMING_SERVICES.map((service) => (
                    <div
                      key={service.name}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-zinc-300">{service.name}</span>
                      <span className="text-red-500 font-bold text-lg">
                        {service.logo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Now Showing
                </h3>
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-4 w-48 md:w-64">
                  {THEATERS.map((theater) => (
                    <div
                      key={theater.name}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-zinc-300">{theater.name}</span>
                      <span className="text-xl">{theater.logo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {movie.title}
              </h1>

              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                <span>{movie.year}</span>
                {movie.mpaaRating && (
                  <>
                    <span>•</span>
                    <span className="rounded border border-zinc-600 px-2 py-0.5 text-xs">
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

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-zinc-800/80 px-3 py-1 text-sm text-zinc-300 ring-1 ring-zinc-700"
                  >
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
                {movie.synopsis}
              </p>

              {/* Cast Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Cast</h3>
                  <button className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors cursor-pointer">
                    View all cast →
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                  {[
                    {
                      name: "Song Kang-ho",
                      role: "Kim Ki-taek",
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=song",
                    },
                    {
                      name: "Lee Sun-kyun",
                      role: "Park Dong-ik",
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=lee",
                    },
                    {
                      name: "Cho Yeo-jeong",
                      role: "Choi Yeon-gyo",
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=cho",
                    },
                    {
                      name: "Choi Woo-shik",
                      role: "Kim Ki-woo",
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=choi",
                    },
                    {
                      name: "Park So-dam",
                      role: "Kim Ki-jung",
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=park",
                    },
                    {
                      name: "Jang Hye-jin",
                      role: "Chung-sook",
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=jang",
                    },
                  ].map((cast) => (
                    <div key={cast.name} className="text-center">
                      <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-zinc-700">
                        <Image
                          src={cast.img}
                          alt={cast.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <p className="text-sm font-medium text-zinc-200 truncate">
                        {cast.name}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">
                        {cast.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Comment Section */}
              <div className="mb-8">
                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-4">
                  <textarea
                    placeholder="Share your thoughts about this movie..."
                    className="w-full bg-zinc-800/50 text-zinc-200 rounded-lg p-3 min-h-100px border border-zinc-700 focus:border-zinc-600 focus:outline-none resize-none placeholder:text-zinc-500"
                  />
                  <div className="flex justify-end items-center mt-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Reviews</h3>
                  <span className="text-sm text-zinc-500">124 reviews</span>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      author: "cinephile_92",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=cinephile",
                      rating: 5,
                      timestamp: "2 hours ago",
                      content:
                        "This is an absolute masterpiece! The cinematography and performances are unforgettable. Bong Joon-ho's direction is brilliant, and the social commentary is razor-sharp.",
                      likes: 24,
                    },
                    {
                      id: 2,
                      author: "movie_buff",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=moviebuff",
                      rating: 4,
                      timestamp: "5 hours ago",
                      content:
                        "One of the greatest films ever made. Still holds up after all these years. The way it blends genres is seamless, and every scene serves a purpose.",
                      likes: 18,
                    }
                  ].map((review) => (
                    <div
                      key={review.id}
                      className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800 p-5"
                    >
                      <div className="flex gap-4">
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 ring-2 ring-zinc-700">
                            <Image
                              src={review.avatar}
                              alt={review.author}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-zinc-200">
                                {review.author}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={
                                        i < review.rating
                                          ? "text-yellow-400"
                                          : "text-zinc-600"
                                      }
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-xs text-zinc-500">
                                  {review.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-zinc-300 text-sm leading-relaxed mb-3">
                            {review.content}
                          </p>

                          {/* Review Actions */}
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-300 transition-colors">
                              <span>👍</span>
                              <span>{review.likes}</span>
                            </button>
                            <button className="text-zinc-400 hover:text-zinc-300 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-6 w-full py-3 text-sm text-zinc-400 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors cursor-pointer">
                  Load More Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}