import { cookies } from 'next/headers';
import { getApiUrl } from '@/src/config/api';

export default async function profileActions() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    // Forward cookies to backend (backend reads from cookies automatically)
    const cookieHeader = cookieStore.toString();
    
    const res = await fetch(getApiUrl('profile'), {
        headers: {
            Cookie: cookieHeader, // Forward all cookies
        },
    });

    // Don't redirect here - middleware already handles auth
    // If we get here, middleware already validated the user
    if (!res.ok) {
        throw new Error('Failed to fetch profile');
    }

    const data = await res.json();
    return data.profile || data; // Return profile data
}