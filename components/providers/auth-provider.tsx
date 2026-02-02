"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@/lib/types";
import { logout as logoutApi } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in on mount
        try {
            const storedUser = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            
            if (storedUser && token && storedUser !== "undefined") {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user data:", error);
            // Clear corrupted data
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            router.push("/");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}