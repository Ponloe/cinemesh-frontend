import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { logout as logoutApi } from '@/lib/auth';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const logout = async () => {
        try {
        await logoutApi();
        } catch (error) {
        console.error('Logout error:', error);
        } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        }
    };

    return { user, isLoading, logout, isAuthenticated: !!user };
}