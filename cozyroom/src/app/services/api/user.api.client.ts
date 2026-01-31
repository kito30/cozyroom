import { getApiUrl } from "@/src/config/api";

/**
 * Client-side auth check
 * Uses credentials: 'include' to send cookies automatically
 */
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
