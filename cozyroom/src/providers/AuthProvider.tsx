'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { checkAuthClient } from "@/src/app/services/api/user.api.client";
import { createSupabaseClient } from "@/src/components/supabase/client";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    realtimeReady: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    realtimeReady: false,
});

export function AuthProvider({children, initialUser}: {children: ReactNode, initialUser: User | null}) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [realtimeReady, setRealtimeReady] = useState(false);
    
    useEffect(() => {
        checkAuthClient().then(({ user: u, access_token, refresh_token }) => {
            setUser(u);
            if (u && access_token && refresh_token) {
                const supabase = createSupabaseClient();
                supabase.auth.setSession({ access_token, refresh_token })
                    .then(() => setRealtimeReady(true));
            }
        });
    }, []);
    
    return (
        <AuthContext.Provider value={{user, setUser, realtimeReady}}>
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
