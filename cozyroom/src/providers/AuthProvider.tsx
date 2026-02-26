'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { checkAuthClient } from "@/src/app/services/api/user.api.client";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
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
            const u = await checkAuthClient();
            setUser(u);
        }

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
