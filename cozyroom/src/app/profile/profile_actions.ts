import { cookies } from 'next/headers';
import { getApiUrl } from '@/src/config/api';

export default async function profileActions() {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore.toString();
    
    const res = await fetch(getApiUrl('profile'), {
        headers: {
            Cookie: cookieHeader, 
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch profile');
    }

    const data = await res.json();
    return data.profile || data; 
}