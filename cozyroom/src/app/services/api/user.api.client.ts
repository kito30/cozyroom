import { getApiUrl } from "@/src/config/api";
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
    } catch {
        return null;
    }
}
