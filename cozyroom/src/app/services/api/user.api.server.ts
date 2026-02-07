'use server';

import { getApiUrl } from "@/src/config/api";
import { cookies } from "next/headers";
import type { Profile, ProfileUpdatePayload } from "@/src/types";

/**
 * Server-side auth check
 */
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
        if(res.ok) {
            const data = await res.json();
            return data.user;
        }
        return null;
    } catch {
        return null;
    }
}

export const getProfileServer = async (): Promise<Profile | null> => {
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
        if (!res.ok) return null;
        const data = await res.json();
        return (data.profile ?? data) as Profile;
    } catch {
        return null;
    }
}

export const updateProfileServer = async (profileData: ProfileUpdatePayload) => {
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
    } catch {
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

/** Returns the image URL on success, null on failure. */
export const uploadAvatarServer = async (
    formData: FormData
): Promise<string | null> => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
        const apiUrl = getApiUrl('avatar');
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                Cookie: cookieHeader
            },
            body: formData,
            cache: 'no-store'
        });
        if (!res.ok) return null;
        const data = await res.json().catch(() => ({}));
        return data.url ?? null;
    } catch {
        return null;
    }
}
