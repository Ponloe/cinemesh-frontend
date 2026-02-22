"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useState, use } from "react";
import { ThumbsUp, MessageSquare, Reply, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

// Mock thread data
const threadData = {
  _id: "65f1a2c9e91b9a0012345678",
  movie: {
    id: 550,
    title: "Fight Club",
    year: 1999,
  },
  title: "What does the ending really mean?",
  created_by: {
    user_id: 12,
    username: "ponloe",
  },
  content: "I've watched this movie three times and I still can't fully grasp what the ending is trying to convey. What are your interpretations?",
  tags: ["theory", "ending", "spoilers"],
  stats: {
    upvotes: 87,
  },
  createdAt: "2024-12-01T08:23:12Z",
  replies: [
    {
      _id: "reply1",
      user_id: 15,
      username: "movieBuff92",
      content: "The ending represents the protagonist's complete break from his materialistic life. The destruction of the credit buildings symbolizes liberation from debt and consumer culture.",
      upvotes: 45,
      createdAt: "2024-12-01T10:15:00Z",
      replies: [
        {
          _id: "reply1-1",
          user_id: 12,
          username: "ponloe",
          content: "That makes a lot of sense! So it's essentially about breaking free from societal constraints?",
          upvotes: 12,
          createdAt: "2024-12-01T11:30:00Z",
          replies: [],
        },
      ],
    },
    {
      _id: "reply2",
      user_id: 23,
      username: "filmCritic",
      content: "Don't forget that Tyler Durden is a manifestation of the narrator's subconscious. The ending is him finally taking control of his own mind.",
      upvotes: 38,
      createdAt: "2024-12-01T14:22:00Z",
      replies: [],
    },
  ],
};

interface Reply {
  _id: string;
  user_id: number;
  username: string;
  content: string;
  upvotes: number;
  createdAt: string;
  replies: Reply[];
}

function ReplyComponent({ reply, depth = 0 }: { reply: Reply; depth?: number }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className={`${depth > 0 ? "ml-8 mt-4" : "mt-4"} border-l-2 border-white/10 pl-4`}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {reply.username[0].toUpperCase()}
        </div>

        <div className="flex-1">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-zinc-300 font-medium">{reply.username}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500 text-sm">{formatDate(reply.createdAt)}</span>
          </div>

          {/* Content */}
          {!isCollapsed && (
            <>
              <p className="text-zinc-300 mb-3">{reply.content}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 mb-3">
                <button className="flex items-center gap-1 text-zinc-500 hover:text-orange-400 transition-colors text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{reply.upvotes}</span>
                </button>
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply</span>
                </button>
                {reply.replies.length > 0 && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                  >
                    {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    <span>{isCollapsed ? "Show" : "Hide"} replies</span>
                  </button>
                )}
              </div>

              {/* Reply Form */}
              {showReplyForm && (
                <div className="mb-4">
                  <textarea
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                    placeholder="Write your reply..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-pink-700 transition-all">
                      Post Reply
                    </button>
                    <button
                      onClick={() => setShowReplyForm(false)}
                      className="px-4 py-2 bg-white/5 text-zinc-400 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Nested Replies */}
          {!isCollapsed && reply.replies.map((nestedReply) => (
            <ReplyComponent key={nestedReply._id} reply={nestedReply} depth={depth + 1} />
          ))}

          {/* Collapsed State */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="text-zinc-500 hover:text-zinc-300 text-sm flex items-center gap-1"
            >
              <ChevronDown className="w-4 h-4" />
              Show {reply.replies.length} {reply.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ThreadPage({ params }: { params: { id: string } }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-red-950/20 to-red-950">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/forum" className="hover:text-zinc-300 transition-colors">
              Forum
            </Link>
            <span>/</span>
            <Link href={`/forum/movie/${threadData.movie.id}`} className="hover:text-zinc-300 transition-colors">
              {threadData.movie.title}
            </Link>
            <span>/</span>
            <span className="text-zinc-400">{threadData.title}</span>
          </div>
        </div>

        {/* Thread Header */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-xl border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              {/* User Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                {threadData.created_by.username[0].toUpperCase()}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-zinc-50 mb-3">
                  {threadData.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {threadData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-sm border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                  <span>by {threadData.created_by.username}</span>
                  <span>•</span>
                  <span>{formatDate(threadData.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <p className="text-zinc-300 text-lg mb-4 pl-16">
              {threadData.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 pl-16">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-zinc-300 transition-all">
                <ThumbsUp className="w-4 h-4" />
                <span>{threadData.stats.upvotes}</span>
              </button>
              <span className="flex items-center gap-2 text-zinc-500">
                <MessageSquare className="w-4 h-4" />
                <span>{threadData.replies.length} replies</span>
              </span>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="rounded-xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
            <h3 className="text-lg font-semibold text-zinc-50 mb-4">Add a Reply</h3>
            <textarea
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none mb-4"
              rows={4}
              placeholder="Share your thoughts..."
            />
            <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg">
              Post Reply
            </button>
          </div>
        </div>

        {/* Replies */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
            <h3 className="text-lg font-semibold text-zinc-50 mb-4">
              {threadData.replies.length} {threadData.replies.length === 1 ? "Reply" : "Replies"}
            </h3>
            <div className="space-y-4">
              {threadData.replies.map((reply) => (
                <ReplyComponent key={reply._id} reply={reply} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}