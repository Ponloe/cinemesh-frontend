"use client";

import Link from "next/link";
import { LogoIcon } from "@/public/icons/cineMashLogo";
import { useAuth } from "@/components/providers/auth-provider";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-8 z-50 px-70">
      <div className="container rounded-full bg-linear-to-r from-white/5 via-white/10 to-white/5 dark:from-black/5 dark:via-black/10 dark:to-black/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
        <div className="px-6 py-3 md:py-3 shadow-sm max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-3 transition-transform hover:scale-105"
              >
                <div className="flex">
                  <LogoIcon />
                </div>
                <h1 className="text-xl font-bold text-zinc-50">CineMesh</h1>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              <Link
                href="/movie"
                className="text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
              >
                Movies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/genre"
                className="text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
              >
                Genre
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/upcoming"
                className="text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
              >
                Upcoming
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <Link
                    href={`/users/${user.username}`}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-semibold">
                      {user.username[0].toUpperCase()}
                    </div>
                    <span className="text-zinc-300 font-medium hidden md:block">
                      {user.username}
                    </span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-zinc-50 px-4 py-1 rounded-lg font-medium border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/register">
                    <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-zinc-50 px-6 py-1 rounded-lg font-medium border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200 cursor-pointer">
                      Sign Up
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="bg-zinc-50 hover:bg-white text-zinc-950 px-6 py-1 rounded-lg font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all duration-200 cursor-pointer">
                      Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}