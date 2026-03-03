import { API_CONFIG } from './constants';
import type { Movie } from './movies-api';

export interface Genre {
    id: number;
    name: string;
    tmdb_id?: number;
}

export interface GenreWithMovies extends Genre {
    movies?: Movie[];
}

// API Response types
interface ApiGenre {
    ID: number;
    Name: string;
    tmdb_id?: number;
}

interface ApiGenreResponse {
    data: ApiGenre[];
}

interface ApiGenreWithMoviesResponse {
    data: ApiGenre & {
        movies?: any[]; // We can define a more specific type if needed
    };
}

function transformGenre(apiGenre: ApiGenre): Genre {
    return {
        id: apiGenre.ID,
        name: apiGenre.Name,
        tmdb_id: apiGenre.tmdb_id,
    };
}

async function genresRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_CONFIG.BASE_API}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        credentials: 'include',
        cache: 'no-store',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ 
            message: 'An error occurred' 
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

export async function getGenres(): Promise<Genre[]> {
    const apiResponse = await genresRequest<ApiGenreResponse>('/genres');
    return apiResponse.data.map(transformGenre);
}

export async function getGenre(idOrName: string | number): Promise<GenreWithMovies> {
    const apiResponse = await genresRequest<ApiGenreWithMoviesResponse>(`/genres/${idOrName}`);
    return transformGenre(apiResponse.data);
}