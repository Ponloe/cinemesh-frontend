"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/public/icons/cineMashLogo";
import { useAuth } from "@/components/providers/auth-provider";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-4 md:top-8 z-50 px-4 md:px-8 lg:px-70">
        <div className="container rounded-full bg-linear-to-r from-white/5 via-white/10 to-white/5 dark:from-black/5 dark:via-black/10 dark:to-black/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
          <div className="px-4 md:px-6 py-3 shadow-sm max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="flex items-center gap-2 md:gap-3 transition-transform hover:scale-105"
                  onClick={closeMobileMenu}
                >
                  <div className="flex">
                    <LogoIcon />
                  </div>
                  <h1 className="text-lg md:text-xl font-bold text-zinc-50">CineMesh</h1>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                <Link
                  href="/movie"
                  className="text-sm lg:text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
                >
                  Movies
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/genre"
                  className="text-sm lg:text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
                >
                  Genre
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/upcoming"
                  className="text-sm lg:text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
                >
                  Upcoming
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </nav>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-2 lg:gap-3">
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-2 lg:gap-3">
                    <Link
                      href={`/users/${user.username}`}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-linear-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user.username[0].toUpperCase()}
                      </div>
                      <span className="text-zinc-300 font-medium hidden lg:block text-sm">
                        {user.username}
                      </span>
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-zinc-50 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-sm font-medium border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/register">
                      <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-zinc-50 px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg text-sm font-medium border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200 cursor-pointer">
                        Sign Up
                      </button>
                    </Link>
                    <Link href="/login">
                      <button className="bg-zinc-50 hover:bg-white text-zinc-950 px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all duration-200 cursor-pointer">
                        Login
                      </button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                <span className={`w-5 h-0.5 bg-zinc-50 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-zinc-50 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-5 h-0.5 bg-zinc-50 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Close Button */}
          <button
            onClick={closeMobileMenu}
            className="self-end p-2 hover:bg-white/5 rounded-lg transition-colors mb-8"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-zinc-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* User Section */}
          {isAuthenticated && user && (
            <div className="mb-8 pb-6 border-b border-white/10">
              <Link
                href={`/users/${user.username}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                onClick={closeMobileMenu}
              >
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-zinc-50 font-medium">{user.username}</p>
                  <p className="text-zinc-400 text-sm">View Profile</p>
                </div>
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 mb-8">
            <Link
              href="/movie"
              className="px-4 py-3 text-zinc-300 hover:text-zinc-50 hover:bg-white/5 rounded-lg transition-all font-medium"
              onClick={closeMobileMenu}
            >
              Movies
            </Link>
            <Link
              href="/genre"
              className="px-4 py-3 text-zinc-300 hover:text-zinc-50 hover:bg-white/5 rounded-lg transition-all font-medium"
              onClick={closeMobileMenu}
            >
              Genre
            </Link>
            <Link
              href="/upcoming"
              className="px-4 py-3 text-zinc-300 hover:text-zinc-50 hover:bg-white/5 rounded-lg transition-all font-medium"
              onClick={closeMobileMenu}
            >
              Upcoming
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="mt-auto space-y-3">
            {isAuthenticated && user ? (
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm text-zinc-50 px-4 py-3 rounded-lg font-medium border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={closeMobileMenu}>
                  <button className="w-full bg-zinc-50 hover:bg-white text-zinc-950 px-4 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all duration-200">
                    Login
                  </button>
                </Link>
                <Link href="/register" onClick={closeMobileMenu}>
                  <button className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm text-zinc-50 px-4 py-3 rounded-lg font-medium border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}