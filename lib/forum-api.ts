import { API_CONFIG, DEFAULT_PAGE_SIZE } from './constants';
import { getToken, getUser } from './auth';
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

async function forumRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const token = getToken();
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
    };

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

    const result = await response.json();
    
    // Check if this is a paginated response
    if (result && typeof result === 'object' && 'success' in result) {
        // If it has pagination, return both data and pagination
        if ('pagination' in result) {
            return {
                data: result.data || [],
                pagination: result.pagination
            } as T;
        }
        // Otherwise, just return the data field
        if ('data' in result) {
            return result.data as T;
        }
    }
    
    return result as T;
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
    const user = getUser();
    if (!user) {
        throw new Error('User must be logged in to create a thread');
    }

    const requestData = {
        ...data,
        created_by: {
            user_id: String(user.id || user._id),
            username: user.username || user.name || user.email?.split('@')[0] || 'Anonymous',
            avatar_url: null,
        },
    };

    return forumRequest<ForumThread>(`/topics/${topicSlug}/threads`, {
        method: 'POST',
        body: JSON.stringify(requestData),
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
    const user = getUser();
    if (!user) {
        throw new Error('User must be logged in to create a reply');
    }

    const requestData = {
        ...data,
        created_by: {
            user_id: String(user.id || user._id),
            username: user.username || user.name || user.email?.split('@')[0] || 'Anonymous',
            avatar_url: null,
        },
    };

    return forumRequest<ForumReply>(`/threads/${threadSlug}/replies`, {
        method: 'POST',
        body: JSON.stringify(requestData),
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