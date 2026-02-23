import { API_CONFIG, DEFAULT_PAGE_SIZE } from './constants';
import { getToken } from './auth';
import type {
    ForumTopic,
    ForumThread,
    ForumReply,
    PaginatedResponse,
    PaginationParams,
    ThreadListParams,
    CreateTopicRequest,
    UpdateTopicRequest,
    CreateThreadRequest,
    UpdateThreadRequest,
    CreateReplyRequest,
    UpdateReplyRequest,
} from './types';

// Base forum API request function
async function forumRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = getToken();
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
    };

    // Add auth token if available
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_CONFIG.FORUM_API}${endpoint}`, {
        ...options,
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ 
            message: 'An error occurred' 
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Helper to build query string
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

// ==================== TOPICS ====================

export async function getTopics(
    params?: PaginationParams
): Promise<PaginatedResponse<ForumTopic>> {
    const query = buildQueryString({
        page: params?.page || 1,
        limit: params?.limit || DEFAULT_PAGE_SIZE,
    });
    return forumRequest<PaginatedResponse<ForumTopic>>(`/topics${query}`);
}

export async function getTopic(slug: string): Promise<ForumTopic> {
    return forumRequest<ForumTopic>(`/topics/${slug}`);
}

export async function createTopic(data: CreateTopicRequest): Promise<ForumTopic> {
    return forumRequest<ForumTopic>('/topics', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateTopic(
    slug: string,
    data: UpdateTopicRequest
): Promise<ForumTopic> {
    return forumRequest<ForumTopic>(`/topics/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteTopic(slug: string): Promise<void> {
    return forumRequest<void>(`/topics/${slug}`, {
        method: 'DELETE',
    });
}

// ==================== THREADS ====================

export async function getThreads(
    params?: ThreadListParams
): Promise<PaginatedResponse<ForumThread>> {
    const query = buildQueryString({
        page: params?.page || 1,
        limit: params?.limit || DEFAULT_PAGE_SIZE,
        topicSlug: params?.topicSlug,
    });
    return forumRequest<PaginatedResponse<ForumThread>>(`/threads${query}`);
}

export async function getThreadsByTopic(
    topicSlug: string,
    params?: PaginationParams
): Promise<PaginatedResponse<ForumThread>> {
    const query = buildQueryString({
        page: params?.page || 1,
        limit: params?.limit || DEFAULT_PAGE_SIZE,
    });
    return forumRequest<PaginatedResponse<ForumThread>>(
        `/topics/${topicSlug}/threads${query}`
    );
}

export async function getThread(slug: string): Promise<ForumThread> {
    return forumRequest<ForumThread>(`/threads/${slug}`);
}

export async function createThread(
    topicSlug: string,
    data: CreateThreadRequest
): Promise<ForumThread> {
    return forumRequest<ForumThread>(`/topics/${topicSlug}/threads`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateThread(
    slug: string,
    data: UpdateThreadRequest
): Promise<ForumThread> {
    return forumRequest<ForumThread>(`/threads/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteThread(slug: string): Promise<void> {
    return forumRequest<void>(`/threads/${slug}`, {
        method: 'DELETE',
    });
}

// ==================== REPLIES ====================

export async function getReplies(
    threadSlug: string,
    params?: PaginationParams
): Promise<PaginatedResponse<ForumReply>> {
    const query = buildQueryString({
        page: params?.page || 1,
        limit: params?.limit || DEFAULT_PAGE_SIZE,
    });
    return forumRequest<PaginatedResponse<ForumReply>>(
        `/threads/${threadSlug}/replies${query}`
    );
}

export async function getReply(id: string): Promise<ForumReply> {
    return forumRequest<ForumReply>(`/replies/${id}`);
}

export async function createReply(
    threadSlug: string,
    data: CreateReplyRequest
): Promise<ForumReply> {
    return forumRequest<ForumReply>(`/threads/${threadSlug}/replies`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateReply(
    id: string,
    data: UpdateReplyRequest
): Promise<ForumReply> {
    return forumRequest<ForumReply>(`/replies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export async function deleteReply(id: string): Promise<void> {
    return forumRequest<void>(`/replies/${id}`, {
        method: 'DELETE',
    });
}