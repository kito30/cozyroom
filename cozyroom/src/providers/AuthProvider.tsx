'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { checkAuthServer } from "@/src/app/services/api/user.api.server";

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

export function AuthProvider({children, initialUser}: {children: ReactNode, initialUser: User | null}) {
    const [user, setUser] = useState<User | null>(initialUser);
    
    useEffect(() => {
        const checkAuth = async () => {
            const user = await checkAuthServer();
            setUser(user);
        }

        // Check auth on mount and when pathname changes
        // Middleware handles token refresh and validation on every request
        // No need for polling - auth state updates when user navigates
        checkAuth();
    }, []);
    
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
