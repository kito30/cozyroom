'use server';

import { getApiUrl } from "@/src/config/api";
import { cookies } from "next/headers";
import type { ChatMessage, Profile, ProfileUpdatePayload } from "@/src/types";

const getCookieHeader = async (): Promise<string> => {
    const cookieStore = await cookies();
    return cookieStore.toString();
};

/**
 * Server-side auth check
 */
export const checkAuthServer = async () => {  
    const cookieHeader = await getCookieHeader();
    try {
        const apiUrl = getApiUrl('auth/me');
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
    const cookieHeader = await getCookieHeader();
    try {
        const apiUrl = getApiUrl('users/me/profile');
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
    const cookieHeader = await getCookieHeader();
    try {
        const apiUrl = getApiUrl('users/me/profile');
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
        const apiUrl = getApiUrl('auth/login');
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
        const apiUrl = getApiUrl('auth/register');
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
    const cookieHeader = await getCookieHeader();
    try {
        const apiUrl = getApiUrl('auth/logout');
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
    const cookieHeader = await getCookieHeader();
    try {
        const apiUrl = getApiUrl('users/me/avatar');
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
export const getMessages = async (roomId: string = 'room-1'): Promise<ChatMessage[]> => {
    const cookieHeader = await getCookieHeader();
    try {
        const apiUrl = getApiUrl(`chat/rooms/${roomId}/messages`);
        const res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader
            },
            cache: 'no-store'
        });

        if (!res.ok) {
            return [];
        }

        const data = await res.json();
        const messages = (data.messages ?? data) as ChatMessage[] | undefined;
        return messages ?? [];
    } catch {
        return [];
    }
}

export const postMessage = async (roomId: string, content: string) => {
    const cookieHeader = await getCookieHeader();
    try {
        const apiUrl = getApiUrl(`chat/rooms/${roomId}/messages`);
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookieHeader
            },
            body: JSON.stringify({ content }),
            cache: 'no-store'
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.message ?? null;
    } catch (error) {
        console.error("[postMessage] Error:", error);
        return null;
    }
}