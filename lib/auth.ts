import { apiRequest } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse } from './types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    
    // Store token and user data
    if (response.token) {
        setToken(response.token);
        setUser(response.user);
    }
    
    return response;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiRequest<AuthResponse>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    
    // Store token and user data
    if (response.token) {
        setToken(response.token);
        setUser(response.user);
    }
    
    return response;
}

export async function logout(): Promise<void> {
    await apiRequest('/logout', {
        method: 'POST',
    });
    
    // Clear stored auth data
    removeToken();
    removeUser();
}

// Token management functions
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
}

// User management functions
export function getUser() {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

export function setUser(user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}