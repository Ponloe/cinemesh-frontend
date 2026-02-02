"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function UserProfile({ params }: { params: { username: string } }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect("/login");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-zinc-950 via-red-950/20 to-red-950 flex items-center justify-center">
        <div className="text-zinc-50 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-red-950/20 to-red-950">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white/5 p-8 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-4xl font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-50 mb-2">
                  {user.username}
                </h1>
                <p className="text-zinc-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="border-t border-white/10 pt-6">
                <h2 className="text-xl font-semibold text-zinc-50 mb-4">Account Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400">Username:</span>
                    <span className="text-zinc-50">{user.username}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-zinc-400">Email:</span>
                    <span className="text-zinc-50">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h2 className="text-xl font-semibold text-zinc-50 mb-4">Your Activity</h2>
                <p className="text-zinc-400">Your movie reviews and watchlist will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}