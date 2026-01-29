import { getProfileServer } from '@/src/app/services/user.service.server';

export default async function profileActions() {
    const res = await getProfileServer();

    if (!res || !res.ok) {
        throw new Error('Failed to fetch profile');
    }

    const data = await res.json();
    return data.profile || data;
}