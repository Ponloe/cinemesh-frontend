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