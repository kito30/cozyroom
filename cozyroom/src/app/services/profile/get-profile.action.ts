'use server';

import { getProfileServer } from '@/src/app/services/api';
import type { Profile } from '@/src/types';

/**
 * Fetch user profile data
 * Returns the profile value from the API response (handles both { profile } and top-level shape)
 */
export async function getProfileAction(): Promise<Profile> {
    const res = await getProfileServer();

    if (!res || !res.ok) {
        throw new Error('Failed to fetch profile');
    }

    const data = await res.json();
    // Pass down the value that exists in the profile (API may return { profile } or profile at top level)
    const profile: Profile = data.profile ?? data;
    return profile;
}
