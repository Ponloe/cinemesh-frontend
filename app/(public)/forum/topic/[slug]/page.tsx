"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTopic, getThreadsByTopic } from "@/lib/forum-api";
import type { ForumTopic, ForumThread } from "@/lib/types";

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [topicData, threadsData] = await Promise.all([
          getTopic(slug),
          getThreadsByTopic(slug, { page, limit: 20 }),
        ]);
        
        setTopic(topicData);
        setThreads(threadsData.data);
        setTotalPages(threadsData.pagination.pages);
      } catch (err) {
        console.error("Failed to fetch topic data:", err);
        setError(err instanceof Error ? err.message : "Failed to load topic");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug, page]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-zinc-50 mb-4">Error Loading Topic</h1>
            <p className="text-zinc-400">{error}</p>
            <Link href="/forum" className="text-orange-400 hover:text-orange-300 mt-4 inline-block">
              ← Back to Forum
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading || !topic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto text-center text-zinc-400 py-8">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            href="/forum"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </Link>

          {/* Topic Header */}
          {/* <div className={`rounded-xl bg-gradient-to-r ${topic.gradient} p-8 backdrop-blur-xl border border-white/10 mb-8`}>
            <h1 className="text-3xl font-bold text-zinc-50 mb-3">
              {topic.name}
            </h1>
            <p className="text-zinc-300 mb-4">{topic.description}</p>
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>{(topic.thread_count || 0).toLocaleString()} threads</span>
            </div>
          </div> */}

          {/* Threads List */}
          <div className="space-y-3">
            {threads.length > 0 ? (
              threads.map((thread) => (
                <Link
                  key={thread._id}
                  href={`/forum/thread/${thread.slug}`}
                  className="block"
                >
                <div className="rounded-lg bg-white/5 hover:bg-white/10 p-4 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-200 group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {thread.is_pinned && (
                        <span className="inline-block px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs font-medium mb-2">
                          PINNED
                        </span>
                      )}
                      <h3 className="text-base font-semibold text-zinc-50 mb-1 group-hover:text-orange-400 transition-colors">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        <span>by {thread.created_by.username}</span>
                        <span>{formatTimeAgo(thread.created_at)}</span>
                        {thread.movie_title && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                            {thread.movie_title}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {thread.stats.reply_count}
                      </span>
                      <span className="flex items-center gap-1 text-orange-400">
                        ↑ {thread.stats.upvotes}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
                  <MessageSquare className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                  Oops, it looks quite empty here
                </h3>
                <p className="text-zinc-500 mb-6">
                  No threads have been created in this topic yet
                </p>
                <Link
                  href="/forum"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Forum
                </Link>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-white/5 text-zinc-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-zinc-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded bg-white/5 text-zinc-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}