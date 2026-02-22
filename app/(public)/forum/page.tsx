"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { Film, TrendingUp, Calendar, Star, MessageSquare } from "lucide-react";

// Mock data for forum topics
const forumTopics = [
  {
    id: 1,
    name: "Movie Discussions",
    slug: "movies",
    description: "Discuss your favorite movies, theories, and analysis",
    thread_count: 1247,
    icon: "film",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 2,
    name: "Trending Now",
    slug: "trending",
    description: "What's hot in cinema right now",
    thread_count: 342,
    icon: "trending",
    gradient: "from-orange-500/20 to-pink-600/20",
  },
  {
    id: 3,
    name: "Upcoming Releases",
    slug: "upcoming",
    description: "Anticipation and predictions for upcoming films",
    thread_count: 189,
    icon: "calendar",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: 4,
    name: "Reviews & Ratings",
    slug: "reviews",
    description: "Share your thoughts and rate movies",
    thread_count: 892,
    icon: "star",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
];

const recentThreads = [
  {
    _id: "1",
    title: "Dune: Part Two - Visual Masterpiece or Overhyped?",
    topic: "Movie Discussions",
    username: "filmBuff89",
    replies: 45,
    upvotes: 123,
    createdAt: "2h ago",
  },
  {
    _id: "2",
    title: "Best Christopher Nolan movies ranked",
    topic: "Reviews & Ratings",
    username: "cinephile_x",
    replies: 67,
    upvotes: 89,
    createdAt: "5h ago",
  },
  {
    _id: "3",
    title: "What are you most excited for in 2025?",
    topic: "Upcoming Releases",
    username: "movieAddict",
    replies: 34,
    upvotes: 56,
    createdAt: "8h ago",
  },
];

const iconComponents = {
  film: Film,
  trending: TrendingUp,
  calendar: Calendar,
  star: Star,
};

export default function ForumIndexPage() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forumTopics.map((topic) => {
              const IconComponent = iconComponents[topic.icon as keyof typeof iconComponents];
              return (
                <Link
                  key={topic.id}
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
                        <div className="flex items-center gap-2 text-zinc-500 text-sm">
                          <MessageSquare className="w-4 h-4" />
                          <span>{topic.thread_count.toLocaleString()} threads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-50 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            {recentThreads.map((thread) => (
              <Link
                key={thread._id}
                href={`/forum/thread/${thread._id}`}
                className="block"
              >
                <div className="rounded-lg bg-white/5 hover:bg-white/10 p-4 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-200 group">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-zinc-50 mb-1 group-hover:text-orange-400 transition-colors">
                        {thread.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-zinc-500">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                          {thread.topic}
                        </span>
                        <span>by {thread.username}</span>
                        <span>{thread.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {thread.replies}
                      </span>
                      <span className="flex items-center gap-1 text-orange-400">
                        ↑ {thread.upvotes}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}