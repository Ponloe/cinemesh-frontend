"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useState, use } from "react";
import { MessageSquare, ThumbsUp, Clock, Tag, ArrowLeft } from "lucide-react";

// Mock data based on topic
const getTopicData = (slug: string) => {
  const topics: Record<string, any> = {
    movies: {
      name: "Movie Discussions",
      description: "Discuss your favorite movies, theories, and analysis",
      threads: [
        {
          _id: "1",
          title: "Fight Club - What does the ending really mean?",
          movie: "Fight Club",
          created_by: { user_id: 12, username: "ponloe" },
          tags: ["theory", "ending", "spoilers"],
          stats: { reply_count: 14, upvotes: 87 },
          createdAt: "2024-12-01T08:23:12Z",
        },
        {
          _id: "2",
          title: "Inception explained: All layers breakdown",
          movie: "Inception",
          created_by: { user_id: 15, username: "dreamWeaver" },
          tags: ["analysis", "theory"],
          stats: { reply_count: 32, upvotes: 156 },
          createdAt: "2024-12-02T14:05:44Z",
        },
      ],
    },
    trending: {
      name: "Trending Now",
      description: "What's hot in cinema right now",
      threads: [
        {
          _id: "3",
          title: "Dune: Part Two is breaking box office records!",
          movie: "Dune: Part Two",
          created_by: { user_id: 18, username: "spiceFlow" },
          tags: ["box-office", "sci-fi"],
          stats: { reply_count: 45, upvotes: 203 },
          createdAt: "2024-12-03T10:15:30Z",
        },
      ],
    },
    upcoming: {
      name: "Upcoming Releases",
      description: "Anticipation and predictions for upcoming films",
      threads: [],
    },
    reviews: {
      name: "Reviews & Ratings",
      description: "Share your thoughts and rate movies",
      threads: [],
    },
  };

  return topics[slug] || topics.movies;
};

export default function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const topicData = getTopicData(slug);
  const [sortBy, setSortBy] = useState<"recent" | "popular">("popular");
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags: string[] = Array.from(
    new Set(topicData.threads.flatMap((t: any) => t.tags))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const filteredThreads = filterTag
    ? topicData.threads.filter((t: any) => t.tags.includes(filterTag))
    : topicData.threads;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto mb-6">
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forums
          </Link>
        </div>

        {/* Topic Header */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="rounded-2xl bg-gradient-to-r from-orange-500/20 to-pink-600/20 p-8 backdrop-blur-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-zinc-50 mb-2">
                  {topicData.name}
                </h1>
                <p className="text-zinc-400 text-lg">{topicData.description}</p>
              </div>
              <button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200">
                + New Thread
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 text-sm">Sort by:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy("popular")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "popular"
                      ? "bg-white/10 text-zinc-50 border border-white/20"
                      : "bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => setSortBy("recent")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === "recent"
                      ? "bg-white/10 text-zinc-50 border border-white/20"
                      : "bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  Recent
                </button>
              </div>
            </div>

            {/* Tag Filters */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 text-sm">Filter:</span>
                <button
                  onClick={() => setFilterTag(null)}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    !filterTag
                      ? "bg-white/10 text-zinc-50 border border-white/20"
                      : "bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      filterTag === tag
                        ? "bg-white/10 text-zinc-50 border border-white/20"
                        : "bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thread List */}
        <div className="max-w-5xl mx-auto space-y-4">
          {filteredThreads.length > 0 ? (
            filteredThreads.map((thread: any) => (
              <Link
                key={thread._id}
                href={`/forum/thread/${thread._id}`}
                className="block"
              >
                <div className="rounded-xl bg-white/5 hover:bg-white/10 p-6 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-200 group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {thread.created_by.username[0].toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-zinc-50 mb-2 group-hover:text-orange-400 transition-colors">
                        {thread.title}
                      </h3>

                      {thread.movie && (
                        <p className="text-zinc-500 text-sm mb-2">
                          in <span className="text-zinc-400">{thread.movie}</span>
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        {thread.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-zinc-400 text-xs border border-white/10"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(thread.createdAt)}
                        </span>
                        <span>by {thread.created_by.username}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {thread.stats.reply_count} replies
                        </span>
                        <span className="flex items-center gap-1 text-orange-400">
                          <ThumbsUp className="w-4 h-4" />
                          {thread.stats.upvotes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-xl bg-white/5 p-12 backdrop-blur-xl border border-white/10 text-center">
              <MessageSquare className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                No threads found
              </h3>
              <p className="text-zinc-500 mb-6">
                {filterTag
                  ? `No threads with the tag "${filterTag}"`
                  : "Be the first to start a discussion!"}
              </p>
              <button className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200">
                Start a Discussion
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}