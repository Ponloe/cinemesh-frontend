import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-orange-500 to-pink-600">
              <span className="text-lg font-bold text-white">C</span>
            </div> */}
            <h1 className="text-xl font-bold text-zinc-50">CineMesh</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden gap-8 text-sm md:flex">
              <a href="#" className="text-zinc-400 transition-colors hover:text-zinc-50">
                Discover
              </a>
              <a href="#" className="text-zinc-400 transition-colors hover:text-zinc-50">
                Popular
              </a>
              <a href="#" className="text-zinc-400 transition-colors hover:text-zinc-50">
                Trending
              </a>
            </nav>
            <div className="flex gap-2">
              <Link href="/login">
                <button className="bg-zinc-800 text-zinc-50 px-4 py-2 rounded-md font-medium hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-zinc-50 text-zinc-950 px-4 py-2 rounded-md font-medium hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}