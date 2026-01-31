'use server';

import { getProfileServer } from '@/src/app/services/api';

/**
 * Fetch user profile data
 * Used by: ProfilePage, ProfileData component
 */
export async function getProfileAction() {
    const res = await getProfileServer();

    if (!res || !res.ok) {
        throw new Error('Failed to fetch profile');
    }

    const data = await res.json();
    return data.profile || data;
}
