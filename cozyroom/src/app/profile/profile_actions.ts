import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function profileActions() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // Forward cookies to backend
    const res = await fetch('http://localhost:3001/profile', {
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