'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getApiUrl } from '@/src/config/api';

export type UpdateProfileState = {
  error?: string | string[];
  success?: boolean;
} | null;

export async function updateProfileAction(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const full_name = formData.get('full_name') as string;
  const bio = formData.get('bio') as string;
  const phone = formData.get('phone') as string;
  const avatar_url = formData.get('avatar_url') as string;

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(getApiUrl('profile'), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        full_name: full_name || null,
        bio: bio || null,
        phone: phone || null,
        avatar_url: avatar_url || null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      const errorMessage = data.message || data.error || 'Failed to update profile';
      return { error: errorMessage };
    }

    // Revalidate the profile page to show updated data
    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    return { error: 'Failed to update profile. Please try again.' };
  }
}
