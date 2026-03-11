// API Configuration
export const API_CONFIG = {
    AUTH_API: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    BASE_API: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/public',
    FORUM_API: process.env.NEXT_PUBLIC_FORUM_API_URL || 'http://localhost:4000/api/forum',
    STREAMING_API: process.env.STREAMING_API_URL || process.env.NEXT_PUBLIC_STREAMING_URL || 'http://localhost:8080/api/public/streaming/movies',
} as const;

export const DEFAULT_PAGE_SIZE = 20;