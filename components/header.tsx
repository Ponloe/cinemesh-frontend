import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-4 z-50 mx-4">
      <div className="sticky container mx-auto rounded-2xl bg-linear-to-r from-white/5 via-white/10 to-white/5 dark:from-black/5 dark:via-black/10 dark:to-black/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-3 transition-transform hover:scale-105"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-linear-to-br from-orange-500 to-pink-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                    <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zm1.5 0v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5A.375.375 0 003 5.625zm16.125-.375a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5A.375.375 0 0021 7.125v-1.5a.375.375 0 00-.375-.375h-1.5zM3 9.375c0-.207.168-.375.375-.375h1.5a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375h-1.5A.375.375 0 013 10.875v-1.5zm16.125-.375a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5zM3 13.125c0-.207.168-.375.375-.375h1.5a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375h-1.5a.375.375 0 01-.375-.375v-1.5zm16.125-.375a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h1.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-1.5z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h1 className="text-xl font-bold text-zinc-50">CineMesh</h1>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              <Link
                href="/tv-series"
                className="text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
              >
                TV Series
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/movies"
                className="text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
              >
                Movies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-orange-500 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/series"
                className="text-base font-medium text-zinc-300 hover:text-zinc-50 transition-colors relative group"
              >
                Series
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
              <Link href="/register">
                <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-zinc-50 px-6 py-2 rounded-lg font-medium border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all duration-200">
                  Sign Up
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-zinc-50 hover:bg-white text-zinc-950 px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all duration-200">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
