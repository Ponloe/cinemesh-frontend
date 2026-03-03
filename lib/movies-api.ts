import { API_CONFIG, DEFAULT_PAGE_SIZE } from './constants';
import type { PaginationParams, PaginatedResponse } from './types';

export interface MovieGenre {
    id: number;
    name: string;
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path?: string;
    order: number;
}

export interface Movie {
    id: number;
    title: string;
    slug: string;
    release_date: string;
    duration_minutes?: number;
    synopsis?: string;
    poster_url: string;
    backdrop_url?: string;
    average_rating?: number;
    mpaa_rating?: string;
    tmdb_id?: number;
    genres?: MovieGenre[];
    cast?: CastMember[];
    director?: string;
    year?: number;
}

export interface MoviesListParams extends PaginationParams {
    search?: string;
    genre?: string;
}

// API Response types (matching Go backend capitalization)
interface ApiMovieGenre {
    ID: number;
    Name: string;
    tmdb_id?: number;
}

interface ApiPerson {
    id: number;
    name: string;
    biography?: string;
    birth_date?: string | null;
    profile_image_url?: string;
    tmdb_id?: number;
    created_at: string;
    updated_at: string;
}

interface ApiCastMember {
    movie_id: number;
    person_id: number;
    role: string;
    character_name?: string;
    cast_order?: number;
    person: ApiPerson;
}

interface ApiMovie {
    ID: number;
    Title: string;
    Slug: string;
    ReleaseDate: string;
    DurationMinutes?: number;
    Synopsis?: string;
    PosterURL: string;
    BackdropURL?: string;
    AverageRating?: number;
    MPAARating?: string;
    tmdb_id?: number | null;
    CreatedAt: string;
    Genres?: ApiMovieGenre[];
    Cast?: ApiCastMember[];
}

interface ApiPaginatedResponse<T> {
    data: T[];
    pagination: {
        limit: number;
        page: number;
        total: number;
        totalPages: number;
    };
}

interface ApiSingleResponse<T> {
    data: T;
}

// Transform functions
function transformGenre(apiGenre: ApiMovieGenre): MovieGenre {
    return {
        id: apiGenre.ID,
        name: apiGenre.Name,
    };
}

function transformCast(apiCast: ApiCastMember): CastMember {
    return {
        id: apiCast.person.id,
        name: apiCast.person.name,
        character: apiCast.character_name || '',
        profile_path: apiCast.person.profile_image_url || undefined,
        order: apiCast.cast_order || 0,
    };
}

function transformMovie(apiMovie: ApiMovie): Movie {
    // Find director from cast
    const director = apiMovie.Cast?.find(c => c.role === 'Director')?.person.name;
    
    return {
        id: apiMovie.ID,
        title: apiMovie.Title,
        slug: apiMovie.Slug,
        release_date: apiMovie.ReleaseDate,
        duration_minutes: apiMovie.DurationMinutes,
        synopsis: apiMovie.Synopsis,
        poster_url: apiMovie.PosterURL,
        backdrop_url: apiMovie.BackdropURL,
        average_rating: apiMovie.AverageRating,
        mpaa_rating: apiMovie.MPAARating,
        tmdb_id: apiMovie.tmdb_id || undefined,
        genres: apiMovie.Genres?.map(transformGenre) || [],
        cast: apiMovie.Cast?.filter(c => c.role === 'Actor').map(transformCast) || [],
        director,
        year: new Date(apiMovie.ReleaseDate).getFullYear(),
    };
}

async function moviesRequest<T>(
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

function buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    });
    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

export async function getMovies(
    params?: MoviesListParams
): Promise<PaginatedResponse<Movie>> {
    const query = buildQueryString({
        page: params?.page || 1,
        limit: params?.limit || DEFAULT_PAGE_SIZE,
        search: params?.search,
        genre: params?.genre,
    });
    
    const apiResponse = await moviesRequest<ApiPaginatedResponse<ApiMovie>>(`/movies${query}`);
    
    return {
        data: apiResponse.data.map(transformMovie),
        pagination: {
            page: apiResponse.pagination.page,
            limit: apiResponse.pagination.limit,
            total: apiResponse.pagination.total,
            pages: apiResponse.pagination.totalPages,
        },
    };
}

export async function getUpcomingMovies(
    params?: PaginationParams
): Promise<PaginatedResponse<Movie>> {
    // Fetch all movies first
    const query = buildQueryString({
        page: params?.page || 1,
        limit: 100, // Get more movies to filter
    });
    
    const apiResponse = await moviesRequest<ApiPaginatedResponse<ApiMovie>>(`/movies${query}`);
    
    // Filter upcoming movies on the frontend
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
    
    const upcomingMovies = apiResponse.data.filter(movie => {
        const releaseDate = new Date(movie.ReleaseDate);
        return releaseDate >= today;
    });
    
    console.log('Total movies:', apiResponse.data.length);
    console.log('Upcoming movies:', upcomingMovies.length);
    
    // Apply pagination to filtered results
    const limit = params?.limit || DEFAULT_PAGE_SIZE;
    const page = params?.page || 1;
    const startIndex = (page - 1) * limit;
    const paginatedMovies = upcomingMovies.slice(startIndex, startIndex + limit);
    
    return {
        data: paginatedMovies.map(transformMovie),
        pagination: {
            page: page,
            limit: limit,
            total: upcomingMovies.length,
            pages: Math.ceil(upcomingMovies.length / limit),
        },
    };
}


export async function getMovie(idOrSlug: string | number): Promise<Movie> {
    const apiResponse = await moviesRequest<ApiSingleResponse<ApiMovie>>(`/movies/${idOrSlug}`);
    return transformMovie(apiResponse.data);
}