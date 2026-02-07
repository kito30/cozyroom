'use server';

import { getProfileServer } from '@/src/app/services/api';
import type { Profile } from '@/src/types';

/**
 * Fetch user profile data
 * Returns the profile value from the API response (handles both { profile } and top-level shape)
 */
export async function getProfileAction(): Promise<Profile> {
    const profile = await getProfileServer();
    if (!profile) {
        throw new Error('Failed to fetch profile');
    }
    return profile;
}
