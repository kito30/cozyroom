'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isPublicPath, ROUTES } from "../config/routes";

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
    const router = useRouter();
    const pathname = usePathname();
    useEffect(()=> {
        const checkAuth = async () => {
        try {
            const res = await fetch("http://localhost:3001/auth", {
                method: "GET",
                credentials: 'include'
            });
            if(res.ok) { 
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
                if(!isPublicPath(pathname))
                router.push(ROUTES.login);
            }
        }
        catch(error) {
            console.error("Error checking auth:", error);
            setUser(null);
            router.push(ROUTES.login);
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

    },[router, pathname]);
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
