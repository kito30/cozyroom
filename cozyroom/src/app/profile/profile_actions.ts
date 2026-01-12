import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getApiUrl } from '@/src/config/api';

export default async function profileActions() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // Forward cookies to backend
    const res = await fetch(getApiUrl('profile'), {
        headers: {
            Cookie: `token=${token}`,
        },
    });

    if (res.status === 401) {
        redirect('/login');
    }

    if (!res.ok) {
        throw new Error('Failed to fetch profile');
    }

    return await res.json();
}