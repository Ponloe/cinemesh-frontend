import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMovie } from "@/lib/movies-api";
import Link from "next/link";
import ShowtimesClient from "./showtimes-client";

const CORE_API = process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:8080";

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
      title: `${movie.title} - Showtimes | CineMesh`,
      description: `View showtimes for ${movie.title}`,
    };
  } catch {
    return { title: "Movie Not Found | CineMesh" };
  }
}

export default async function ShowtimesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ provider?: string }>;
}) {
  const { slug } = await params;
  const { provider } = await searchParams;

  let movie;
  try {
    movie = await getMovie(slug);
  } catch {
    notFound();
  }

  const showtimes = await getShowtimes(movie.id);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <Link
            href={`/movies/${slug}`}
            className="text-zinc-400 hover:text-white mb-8 inline-flex items-center gap-2"
          >
            ← Back to {movie.title}
          </Link>

          <h1 className="text-4xl font-bold text-white mb-2">
            {movie.title}
          </h1>
          <p className="text-zinc-400 mb-8">Now Showing</p>

          <ShowtimesClient showtimes={showtimes} movieSlug={slug} providerParam={provider} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
