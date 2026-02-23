// API Configuration
export const API_CONFIG = {
    AUTH_API: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    FORUM_API: process.env.NEXT_PUBLIC_FORUM_API_URL || 'http://localhost:4000/api/forum',
} as const;

export const DEFAULT_PAGE_SIZE = 20;