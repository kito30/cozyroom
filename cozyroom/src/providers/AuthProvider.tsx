'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { checkAuthClient } from "@/src/app/services/api";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null; // Token is stored in httpOnly cookies, not accessible client-side
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    token: null,
});

export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await checkAuthClient();
                if (res && res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            }
        }

        // Check auth on mount and when pathname changes
        // Middleware handles token refresh and validation on every request
        // No need for polling - auth state updates when user navigates
        checkAuth();
    }, [pathname]);
    
    return (
        <AuthContext.Provider value={{user, setUser, token: null}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
