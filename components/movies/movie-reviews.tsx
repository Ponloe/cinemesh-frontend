"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createMovieReview, getMovieReviews } from "@/lib/forum-api";
import { isAuthenticated } from "@/lib/auth";
import type { ForumThread } from "@/lib/types";

type MovieReviewsProps = {
  movieId: number;
  movieTitle: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MovieReviews({ movieId, movieTitle }: MovieReviewsProps) {
  const router = useRouter();

  const [reviews, setReviews] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");

  const movieSlug = useMemo(() => slugify(movieTitle), [movieTitle]);

  const loadReviews = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await getMovieReviews(movieId, { page: 1, limit: 20 });
      setReviews(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      await createMovieReview(
        {
          id: movieId,
          title: movieTitle,
          slug: movieSlug,
        },
        content.trim()
      );

      setContent("");
      await loadReviews();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 md:p-5 mb-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Share your thoughts about ${movieTitle}...`}
            className="w-full min-h-[120px] rounded-lg border border-zinc-700 bg-zinc-950/70 px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-semibold text-white hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <p className="text-sm text-red-400 mb-3">{error}</p>
      )}

      {isLoading ? (
        <p className="text-zinc-400 text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No reviews yet. Be the first to review this movie.
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="font-medium text-zinc-100">
                  {review.created_by?.username || "Anonymous"}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatTime(review.created_at)}
                </span>
              </div>
              <p className="text-zinc-300 whitespace-pre-wrap">{review.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}