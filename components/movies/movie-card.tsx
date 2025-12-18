import Image from "next/image";
import { Movie } from "@/lib/mock-data";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group relative cursor-pointer">
      <div className="aspect-[2/3] overflow-hidden rounded-md bg-zinc-900 shadow-lg shadow-black/20 ring-1 ring-zinc-800 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/40 group-hover:ring-zinc-700">
        <Image
          src={movie.poster}
          alt={`${movie.title} poster`}
          width={300}
          height={450}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-75"
          unoptimized
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex items-center rounded-full bg-yellow-500/20 px-2 py-1">
                <span className="text-sm text-yellow-400">★</span>
                <span className="ml-1 text-sm font-medium text-yellow-100">
                  {movie.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <h3 className="mb-1 text-base font-semibold text-white">
              {movie.title}
            </h3>
            <p className="text-sm text-zinc-300">{movie.director}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {movie.genre.map((g) => (
                <span
                  key={g}
                  className="rounded bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-300"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Info below poster */}
      <div className="mt-3">
        <h3 className="truncate text-sm font-medium text-zinc-100 transition-colors group-hover:text-white">
          {movie.title}
        </h3>
        <p className="text-xs text-zinc-500">{movie.year}</p>
      </div>
    </div>
  );
}