export interface Movie {
  id: number;
  title: string;
  slug: string;
  year: number;
  rating: number;
  poster: string;
  director: string;
  genre: string[];
}

export const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Blade Runner 2049",
    slug: "blade-runner-2049",
    year: 2017,
    rating: 4.2,
    poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    director: "Denis Villeneuve",
    genre: ["Sci-Fi", "Thriller"]
  },
  {
    id: 2,
    title: "The Grand Budapest Hotel",
    slug: "the-grand-budapest-hotel",
    year: 2014,
    rating: 4.5,
    poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
    director: "Wes Anderson",
    genre: ["Comedy", "Drama"]
  },
  {
    id: 3,
    title: "Parasite",
    slug: "parasite",
    year: 2019,
    rating: 4.6,
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    director: "Bong Joon-ho",
    genre: ["Thriller", "Drama"]
  },
  {
    id: 4,
    title: "Mad Max: Fury Road",
    slug: "mad-max-fury-road",
    year: 2015,
    rating: 4.4,
    poster: "https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg",
    director: "George Miller",
    genre: ["Action", "Adventure"]
  },
  {
    id: 5,
    title: "Interstellar",
    slug: "interstellar",
    year: 2014,
    rating: 4.3,
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    director: "Christopher Nolan",
    genre: ["Sci-Fi", "Drama"]
  },
  {
    id: 6,
    title: "The Lighthouse",
    slug: "the-lighthouse",
    year: 2019,
    rating: 4.1,
    poster: "https://image.tmdb.org/t/p/w500/3nk9UoepYmv1G9oP18q6JJCeYwN.jpg",
    director: "Robert Eggers",
    genre: ["Horror", "Drama"]
  },
  {
    id: 7,
    title: "Moonlight",
    slug: "moonlight",
    year: 2016,
    rating: 4.4,
    poster: "https://image.tmdb.org/t/p/original/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg",
    director: "Barry Jenkins",
    genre: ["Drama"]
  },
  {
    id: 8,
    title: "Arrival",
    slug: "arrival",
    year: 2016,
    rating: 4.2,
    poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
    director: "Denis Villeneuve",
    genre: ["Sci-Fi", "Drama"]
  },
  {
    id: 9,
    title: "Whiplash",
    slug: "whiplash",
    year: 2014,
    rating: 4.5,
    poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    director: "Damien Chazelle",
    genre: ["Drama", "Music"]
  },
  {
    id: 10,
    title: "Her",
    slug: "her",
    year: 2013,
    rating: 4.0,
    poster: "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg",
    director: "Spike Jonze",
    genre: ["Romance", "Sci-Fi"]
  }
];