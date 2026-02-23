export interface User {
    id: number;
    email: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Forum Types
export interface ForumTopic {
    _id: string;
    name: string;
    slug: string;
    description: string;
    thread_count: number;
    icon: string;
    gradient: string;
    created_at: string;
    updated_at: string;
}

export interface ForumThread {
    _id: string;
    slug: string; 
    topic_slug: string;
    movie_id?: number;
    movie_title?: string;
    title: string;
    content: string;
    created_by: {
        user_id: number;
        username: string;
        avatar_url?: string; 
    };
    tags: string[];
    stats: {
        reply_count: number;
        upvotes: number;
        views: number;
    };
    is_pinned: boolean;
    is_locked: boolean;
    created_at: string;
    updated_at: string;
    last_activity_at: string;
}

export interface ForumReply {
    _id: string;
    thread_id: string;
    parent_id: string | null;
    depth: number;
    content: string;
    created_by: {
        user_id: number;
        username: string;
        avatar_url?: string; 
    };
    stats: {
        upvotes: number;
        downvotes: number;
    };
    replies: ForumReply[]; 
    is_edited: boolean;
    edited_at?: string;
    created_at: string;
    updated_at: string;
}

// Request Types for Forum API
export interface CreateTopicRequest {
    name: string;
    slug: string;
    description: string;
    icon?: string;
    gradient?: string;
}

export interface UpdateTopicRequest {
    name?: string;
    description?: string;
    icon?: string;
    gradient?: string;
}

export interface CreateThreadRequest {
    title: string;
    content: string;
    movie_id?: number;
    tags?: string[];
}

export interface UpdateThreadRequest {
    title?: string;
    content?: string;
    tags?: string[];
    is_pinned?: boolean;
    is_locked?: boolean;
}

export interface CreateReplyRequest {
    content: string;
    parent_id?: string;
}

export interface UpdateReplyRequest {
    content: string;
}

export interface ThreadListParams extends PaginationParams {
    topicSlug?: string;
}