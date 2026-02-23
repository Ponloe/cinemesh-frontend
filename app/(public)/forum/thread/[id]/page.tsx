"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, MessageSquare, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getThread, getReplies, createReply, updateThread } from "@/lib/forum-api";
import { isAuthenticated, getUser } from "@/lib/auth";
import type { ForumThread, ForumReply } from "@/lib/types";

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.id as string;

  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Reply state
  const [replyContent, setReplyContent] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentUser = getUser();
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [threadData, repliesData] = await Promise.all([
          getThread(slug),
          getReplies(slug, { page, limit: 20 }),
        ]);
        
        setThread(threadData);
        setReplies(repliesData.data || []);
        setTotalPages(repliesData.pagination?.pages || 1);
      } catch (err) {
        console.error("Failed to fetch thread data:", err);
        setError(err instanceof Error ? err.message : "Failed to load thread");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug, page]);

  const handleUpvoteThread = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      const userId = String(currentUser?.id || currentUser?._id);
      const hasUpvoted = thread?.upvoted_by?.includes(userId);
      
      const updatedUpvotes = hasUpvoted
        ? thread!.stats.upvotes - 1
        : thread!.stats.upvotes + 1;

      await updateThread(slug, {
        // You may need to adjust this based on your API
      });

      setThread((prev) => prev ? {
        ...prev,
        stats: { ...prev.stats, upvotes: updatedUpvotes },
        upvoted_by: hasUpvoted
          ? prev.upvoted_by?.filter((id) => id !== userId)
          : [...(prev.upvoted_by || []), userId],
      } : null);
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!replyContent.trim()) {
      setSubmitError("Reply content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const newReply = await createReply(slug, {
        content: replyContent,
        parent_id: replyToId || undefined,
      });

      // Refresh replies
      const repliesData = await getReplies(slug, { page, limit: 20 });
      setReplies(repliesData.data || []);
      
      // Update thread reply count
      if (thread) {
        setThread({
          ...thread,
          stats: {
            ...thread.stats,
            reply_count: thread.stats.reply_count + 1,
          },
        });
      }

      // Reset form
      setReplyContent("");
      setReplyToId(null);
    } catch (err) {
      console.error("Failed to submit reply:", err);
      setSubmitError(err instanceof Error ? err.message : "Failed to submit reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const renderReply = (reply: ForumReply) => {
    const isReplyingTo = replyToId === reply._id;

    return (
      <div key={reply._id} className={`${reply.depth > 0 ? 'ml-8 mt-3' : ''}`}>
        <div className="rounded-lg bg-white/5 p-4 backdrop-blur-xl border border-white/10">
          {/* Reply Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold">
                {reply.created_by?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-semibold text-zinc-50">
                  {reply.created_by?.username || 'Unknown'}
                </div>
                <div className="text-sm text-zinc-500">
                  {formatTimeAgo(reply.created_at)}
                  {reply.is_edited && " (edited)"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <button className="flex items-center gap-1 text-zinc-400 hover:text-orange-400 transition-colors">
                <ArrowUp className="w-4 h-4" />
                {reply.stats.upvotes}
              </button>
            </div>
          </div>

          {/* Reply Content */}
          <div className="text-zinc-300 mb-3 whitespace-pre-wrap">
            {reply.content}
          </div>

          {/* Reply Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  router.push("/login");
                  return;
                }
                setReplyToId(isReplyingTo ? null : reply._id);
              }}
              className={`${
                isReplyingTo
                  ? "text-orange-400"
                  : "text-zinc-500 hover:text-zinc-400"
              } transition-colors`}
            >
              {isReplyingTo ? "Cancel Reply" : "Reply"}
            </button>
          </div>

          {/* Nested Reply Form */}
          {isReplyingTo && (
            <div className="mt-4">
              <form onSubmit={handleSubmitReply}>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Reply to ${reply.created_by.username}...`}
                  className="w-full min-h-[100px] px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                  disabled={isSubmitting}
                />
                {submitError && (
                  <p className="text-red-400 text-sm mt-2">{submitError}</p>
                )}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyToId(null);
                      setReplyContent("");
                    }}
                    className="px-4 py-2 rounded bg-white/5 text-zinc-400 hover:bg-white/10 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors disabled:opacity-50"
                    disabled={isSubmitting || !replyContent.trim()}
                  >
                    {isSubmitting ? "Posting..." : "Post Reply"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Nested Replies */}
        {reply.replies && reply.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {reply.replies.map(renderReply)}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-zinc-50 mb-4">Error Loading Thread</h1>
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

  if (isLoading || !thread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center text-zinc-400 py-8">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const hasUpvoted = thread.upvoted_by?.includes(String(currentUser?.id || currentUser?._id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href={`/forum/topic/${thread.topic_slug}`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {thread.topic_slug}
          </Link>

          {/* Thread */}
          <div className="rounded-lg bg-white/5 p-6 backdrop-blur-xl border border-white/10 mb-8">
            {/* Thread Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold text-lg">
                  {thread.created_by?.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-zinc-50">
                    {thread.created_by?.username || 'Unknown'}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {formatTimeAgo(thread.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-zinc-400">
                  <MessageSquare className="w-4 h-4" />
                  {thread.stats?.reply_count || 0}
                </span>
                <button
                  onClick={handleUpvoteThread}
                  className={`flex items-center gap-1 transition-colors ${
                    hasUpvoted
                      ? "text-orange-400 hover:text-orange-300"
                      : "text-zinc-400 hover:text-orange-400"
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                  {thread.stats?.upvotes || 0}
                </button>
              </div>
            </div>

            {/* Thread Title & Content */}
            <h1 className="text-2xl font-bold text-zinc-50 mb-4">
              {thread.title}
            </h1>
            {thread.movie_title && (
              <div className="mb-4">
                <span className="px-3 py-1 rounded bg-white/10 text-zinc-300 text-sm">
                  {thread.movie_title}
                </span>
              </div>
            )}
            <div className="text-zinc-300 mb-4 whitespace-pre-wrap">
              {thread.content}
            </div>

            {/* Thread Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded bg-white/5 text-zinc-400 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Reply Form */}
          {!replyToId && (
            <div className="rounded-lg bg-white/5 p-6 backdrop-blur-xl border border-white/10 mb-8">
              <h3 className="text-lg font-semibold text-zinc-50 mb-4">
                Add a Reply
              </h3>
              {isLoggedIn ? (
                <form onSubmit={handleSubmitReply}>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full min-h-[150px] px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                    disabled={isSubmitting}
                  />
                  {submitError && (
                    <p className="text-red-400 text-sm mt-2">{submitError}</p>
                  )}
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors disabled:opacity-50"
                      disabled={isSubmitting || !replyContent.trim()}
                    >
                      {isSubmitting ? "Posting..." : "Post Reply"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-400 mb-4">
                    You must be logged in to reply
                  </p>
                  <Link
                    href="/login"
                    className="inline-block px-6 py-2 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Replies Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-zinc-50 mb-4">
              Replies ({thread.stats?.reply_count || 0})
            </h2>
            {replies.length > 0 ? (
              <div className="space-y-3">
                {replies.map(renderReply)}
              </div>
            ) : (
              <div className="text-center text-zinc-500 py-8">
                No replies yet. Be the first to reply!
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded bg-white/5 text-zinc-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-zinc-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded bg-white/5 text-zinc-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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