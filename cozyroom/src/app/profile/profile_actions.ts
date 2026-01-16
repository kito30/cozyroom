import { redirect } from 'next/navigation';
import { getApiUrl } from '@/src/config/api';

export default async function profileActions() {

    // Forward cookies to backend
    const res = await fetch(getApiUrl('profile'));
    console.log(res);
    if (res.status === 401) {
        redirect('/login');
    }

    if (!res.ok) {
        throw new Error('Failed to fetch profile');
    }

    return await res.json();
}