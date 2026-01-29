import { getApiUrl } from "@/src/config/api";
import { cookies } from "next/headers";
// For client components
export const checkAuthClient = async () => {
    try {
        const apiUrl = getApiUrl('auth');
        const res = await fetch(apiUrl, {
            method: "GET",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res;
    } catch (error) {
        console.error("[checkAuthClient] Error:", error);
        return null;
    }
}

// For server components
export const checkAuthServer = async () => {  
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    try {
        const apiUrl = getApiUrl('auth');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            Cookie: cookieHeader
        };
        
        const res = await fetch(apiUrl, {
            method: "GET",
            headers,
            cache: 'no-store'
        });
        return res;
    } catch (error) {
        console.error("[checkAuthServer] Error:", error);
        return null;
    }
}

export const getProfileServer = async () => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    try {
        const apiUrl = getApiUrl('profile');
        const res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader
            },
            cache: 'no-store'
        });
        return res;
    } catch (error) {
        console.error("[getProfileServer] Error:", error);
        return null;
    }
}

export const updateProfileServer = async (profileData: {
    full_name?: string | null;
    bio?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
}) => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    try {
        const apiUrl = getApiUrl('profile');
        const res = await fetch(apiUrl, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader
            },
            body: JSON.stringify(profileData),
            cache: 'no-store'
        });
        return res;
    } catch (error) {
        console.error("[updateProfileServer] Error:", error);
        return null;
    }
}


export const loginServer = async (email: string, password: string) => {
    try {
        const apiUrl = getApiUrl('login');
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            cache: 'no-store'
        });
        return res;
    } catch (error) {
        console.error("[loginServer] Error:", error);
        return null;
    }
}


export const registerServer = async (email: string, password: string, confirm_password: string) => {
    try {
        const apiUrl = getApiUrl('signup');
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, confirm_password }),
            cache: 'no-store'
        });
        return res;
    } catch (error) {
        console.error("[registerServer] Error:", error);
        return null;
    }
}


export const logoutServer = async () => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    try {
        const apiUrl = getApiUrl('logout');
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader
            },
            cache: 'no-store'
        });
        return res;
    } catch (error) {
        console.error("[logoutServer] Error:", error);
        return null;
    }
}