export function Hero() {
  return (
    <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h2 className="mb-4 text-5xl font-bold leading-tight text-zinc-50">
            Discover Your Next
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Favorite Film
            </span>
          </h2>
          <p className="text-lg text-zinc-400">
            Explore a curated collection of cinema's finest moments. 
            From timeless classics to modern masterpieces.
          </p>
        </div>
      </div>
    </section>
  );
}