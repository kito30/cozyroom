'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getApiUrl } from "../config/api";

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null; // Token is stored in httpOnly cookies, not accessible client-side
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    token: null,
    isLoading: true,
});

export function AuthProvider({children}: {children: ReactNode}) {

    const [user, setUser] = useState <User | null> (null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const pathname = usePathname();
    useEffect(()=> {
        const checkAuth = async () => {
        try {
            const apiUrl = getApiUrl('auth');
            const res = await fetch(apiUrl, {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if(res.ok) { 
                const data = await res.json();
                setUser(data.user);
                
                // Don't redirect here - middleware already handles auth
                // Only update the user state for UI purposes
                // If middleware allowed the request through, user should be authenticated
            } else {
                setUser(null);
     
            }
        }
        catch(error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }
    checkAuth();
    const interval = setInterval(() => {
        checkAuth();
    }, 1000 * 60 * 5); 

        // clean up
        return () => clearInterval(interval);

    },[pathname]);
    return (
        <AuthContext.Provider value={{user, setUser, token: null, isLoading}}>
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
