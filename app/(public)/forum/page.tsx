"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Film, TrendingUp, Calendar, Star, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { getTopics, getThreadsByTopic } from "@/lib/forum-api";
import type { ForumTopic, ForumThread } from "@/lib/types";

const iconComponents = {
  film: Film,
  trending: TrendingUp,
  calendar: Calendar,
  star: Star,
};

const topicIconMap: Record<string, keyof typeof iconComponents> = {
  movies: "film",
  trending: "trending",
  upcoming: "calendar",
  reviews: "star",
};

export default function ForumIndexPage() {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [recentThreads, setRecentThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // First fetch topics
        const topicsData = await getTopics({ page: 1, limit: 10 });
        console.log('Topics Data:', topicsData);
        
        // Check if topicsData has the expected structure
        const topicsArray = topicsData?.data || topicsData || [];
        setTopics(Array.isArray(topicsArray) ? topicsArray : []);
        
        // Then fetch recent threads from the first topic if available
        if (Array.isArray(topicsArray) && topicsArray.length > 0) {
          const firstTopicSlug = topicsArray[0].slug;
          const threadsData = await getThreadsByTopic(firstTopicSlug, { 
            page: 1, 
            limit: 3 
          });
          console.log('Threads Data:', threadsData);
          
          // Check if threadsData has the expected structure
          const threadsArray = threadsData?.data || threadsData || [];
          setRecentThreads(Array.isArray(threadsArray) ? threadsArray : []);
        }
      } catch (err) {
        console.error("Failed to fetch forum data:", err);
        setError(err instanceof Error ? err.message : "Failed to load forum data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Helper function to format time
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'just now';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'just now';
    }
    
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
            <h1 className="text-2xl font-bold text-zinc-50 mb-4">Error Loading Forum</h1>
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
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-zinc-50 mb-4">
            CineMesh Forums
          </h1>
          <p className="text-zinc-400 text-lg">
            Join the conversation with fellow movie enthusiasts
          </p>
        </div>

        {/* Topics Grid */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-zinc-50 mb-6">Browse Topics</h2>
          {isLoading ? (
            <div className="text-center text-zinc-400 py-8">Loading topics...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => {
                const iconKey = topicIconMap[topic.slug] || "film";
                const IconComponent = iconComponents[iconKey];
                return (
                  <Link
                    key={topic._id}
                    href={`/forum/topic/${topic.slug}`}
                    className="block"
                  >
                    <div className={`rounded-xl bg-gradient-to-r ${topic.gradient} p-6 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-200 group`}>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all">
                          <IconComponent className="w-6 h-6 text-zinc-50" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-zinc-50 mb-2 group-hover:text-orange-400 transition-colors">
                            {topic.name}
                          </h3>
                          <p className="text-zinc-400 text-sm mb-3">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-50 mb-6">Recent Activity</h2>
          {isLoading ? (
            <div className="text-center text-zinc-400 py-8">Loading recent threads...</div>
          ) : recentThreads.length > 0 ? (
            <div className="space-y-3">
              {recentThreads.map((thread) => (
                <Link
                  key={thread._id}
                  href={`/forum/thread/${thread.slug}`}
                  className="block"
                >
                  <div className="rounded-lg bg-white/5 hover:bg-white/10 p-4 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-200 group">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-zinc-50 mb-1 group-hover:text-orange-400 transition-colors">
                          {thread.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                          <span>by {thread.created_by?.username || 'Unknown'}</span>
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
              ))}
            </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
                  <MessageSquare className="w-10 h-10 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-400 mb-2">
                  Oops, it looks quite empty here
                </h3>
                <p className="text-zinc-500">
                  No recent activity in the forums yet
                </p>
              </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
}