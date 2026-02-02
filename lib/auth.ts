import { apiRequest } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse } from './types';

export async function login(data: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
return apiRequest<AuthResponse>('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function logout(): Promise<void> {
        return apiRequest('/logout', {
    method: 'POST',
    });
}