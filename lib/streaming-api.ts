import { API_CONFIG } from './constants';

function normalizeUrl(url: string | null | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
}

export interface StreamingProvider {
    id: number;
    movie_id: number;
    provider_name: string;
    provider_id: string;
    logo_path: string;
    type: 'flatrate' | 'rent' | 'buy' | 'ads';
    region: string;
    link: string | null;
    created_at: string;
    updated_at: string;
}

interface StreamingMovieResponse {
    id: number;
    tmdb_id: number;
    title: string;
    trailer_url: string | null;
    watch_link: string | null;
    streaming_providers: StreamingProvider[];
}

export async function getFullStreamingData(
    coreTitle: string,
    coreTmdbId?: number | null
): Promise<{
    watch_link?: string;
    trailer_url?: string;
    streaming_providers: StreamingProvider[];
}> {
    try {
        const res = await fetch(API_CONFIG.STREAMING_API, { cache: 'no-store' })

        if (!res.ok) return { streaming_providers: [] }

        const data = await res.json()
        const movies: StreamingMovieResponse[] = data.data ?? []

        const movie = coreTmdbId
            ? movies.find(m => m.tmdb_id === coreTmdbId)
            : movies.find(m => m.title.toLowerCase() === coreTitle.toLowerCase())

        if (!movie) return { streaming_providers: [] }

        // Normalize all URLs to ensure they have https:// prefix
        const normalizedProviders = movie.streaming_providers?.map(provider => ({
            ...provider,
            link: normalizeUrl(provider.link) || null
        })) || [];

        return {
            watch_link:          normalizeUrl(movie.watch_link),
            trailer_url:         normalizeUrl(movie.trailer_url),
            streaming_providers: normalizedProviders,
        }
    } catch (e) {
        console.error('Failed to fetch streaming data:', e)
        return { streaming_providers: [] }
    }
}