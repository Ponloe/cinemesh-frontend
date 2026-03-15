import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getMovie } from "@/lib/movies-api";
import { Suspense } from "react";
import SeatsClient from "./seats-client";

const CORE_API =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/public", "") ||
  "http://localhost:8080";

type PageParams = {
  slug: string;
  showtimeId: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const movie = await getMovie(slug);
    return {
      title: `Select Seats - ${movie.title} | CineMesh`,
      description: `Choose seats for ${movie.title}`,
    };
  } catch {
    return { title: "Showtime Not Found | CineMesh" };
  }
}

async function getReservedSeats(showtimeId: string, token?: string | null) {
  try {
    const res = await fetch(
      `${CORE_API}/api/public/showtimes/${showtimeId}/reserved-seats`,
      {
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return (data.data as string[]) || [];
  } catch {
    return [];
  }
}

export default async function SeatsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug, showtimeId } = await params;

  let movie;
  try {
    movie = await getMovie(slug);
  } catch {
    notFound();
  }

  // Note: token is handled client-side via AuthProvider; this page just renders UI

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <p className="text-zinc-400 text-sm mb-2">
              {movie.title} • Select your seats
            </p>
            <h1 className="text-3xl font-bold text-white">Seat Selection</h1>
          </div>

          <Suspense fallback={<div className="text-zinc-400">Loading seats...</div>}>
            <SeatsClient
              showtimeId={showtimeId}
              movieTitle={movie.title}
            />
          </Suspense>
        </div>
      </div>

      <Footer />
    </div>
  );
}

