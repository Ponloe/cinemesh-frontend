"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTopic, getThreadsByTopic, createThread, deleteThread } from "@/lib/forum-api";
import { isAuthenticated, getUser } from "@/lib/auth";
import type { ForumTopic, ForumThread, CreateThreadRequest } from "@/lib/types";
import { MessageSquare, Plus, Trash2, Edit } from "lucide-react";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [topic, setTopic] = useState<ForumTopic | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  
  const user = getUser();
  const authenticated = isAuthenticated();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [topicData, threadsData] = await Promise.all([
          getTopic(slug),
          getThreadsByTopic(slug, { page: 1, limit: 20 }),
        ]);
        
        console.log('Topic Data:', topicData);
        console.log('Threads Data:', threadsData);
        
        setTopic(topicData);
        // Add safety check for threadsData.data
        setThreads(threadsData?.data || []);
      } catch (err) {
        console.error("Failed to fetch topic data:", err);
        setError(err instanceof Error ? err.message : "Failed to load topic");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticated) {
      router.push("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      const newThread = await createThread(slug, formData);
      setThreads([newThread, ...threads]);
      setFormData({ title: "", content: "" });
      setShowCreateForm(false);
    } catch (err) {
      console.error("Failed to create thread:", err);
      alert(err instanceof Error ? err.message : "Failed to create thread");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteThread = async (threadSlug: string) => {
    if (!confirm("Are you sure you want to delete this thread?")) return;

    try {
      await deleteThread(threadSlug);
      setThreads(threads.filter((t) => t.slug !== threadSlug));
    } catch (err) {
      console.error("Failed to delete thread:", err);
      alert(err instanceof Error ? err.message : "Failed to delete thread");
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-zinc-50 mb-4">Error Loading Topic</h1>
            <p className="text-zinc-400">{error}</p>
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
          {/* Header */}
          <div className="mb-8">
            <Link href="/forum" className="text-orange-400 hover:text-orange-300 mb-4 inline-block">
              ← Back to Forums
            </Link>
            {isLoading ? (
              <div className="text-zinc-400">Loading...</div>
            ) : topic && (
              <>
                <h1 className="text-4xl font-bold text-zinc-50 mb-2">{topic.name}</h1>
                <p className="text-zinc-400">{topic.description}</p>
              </>
            )}
          </div>

          {/* Create Thread Button */}
          {authenticated && (
            <div className="mb-6">
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Thread
                </button>
              ) : (
                <div className="rounded-lg bg-white/5 p-6 backdrop-blur-xl border border-white/10">
                  <h3 className="text-xl font-semibold text-zinc-50 mb-4">Create New Thread</h3>
                  <form onSubmit={handleCreateThread} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-zinc-50 focus:outline-none focus:border-orange-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Content
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-zinc-50 focus:outline-none focus:border-orange-400"
                        required
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-lg transition-colors"
                      >
                        {isSubmitting ? "Creating..." : "Create Thread"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Threads List */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-center text-zinc-400 py-8">Loading threads...</div>
            ) : threads && threads.length > 0 ? (
              threads.map((thread) => (
                <div
                  key={thread._id}
                  className="rounded-lg bg-white/5 hover:bg-white/10 p-4 backdrop-blur-xl border border-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Link href={`/forum/thread/${thread.slug}`} className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-zinc-50 mb-2 hover:text-orange-400 transition-colors">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        <span>by {thread.created_by?.username || "Unknown"}</span>
                        <span>{formatTimeAgo(thread.created_at)}</span>
                        {thread.movie_title && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                            {thread.movie_title}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {thread.stats?.reply_count || 0}
                      </span>
                      <span className="flex items-center gap-1 text-orange-400">
                        ↑ {thread.stats?.upvotes || 0}
                      </span>
                      {user && thread.created_by?.user_id === String(user.id || user._id) && (
                        <button
                          onClick={() => handleDeleteThread(thread.slug)}
                          className="p-1 hover:bg-red-500/20 rounded text-red-400 hover:text-red-300 transition-colors"
                          title="Delete thread"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
                  <MessageSquare className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                  No threads yet
                </h3>
                <p className="text-zinc-500">
                  Be the first to start a discussion in this topic!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}