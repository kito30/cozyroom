'use server';

import { revalidatePath } from 'next/cache';
import { updateProfileServer, uploadAvatarServer } from '@/src/app/services/api';
import type { UpdateProfileInfoState, ProfileUpdatePayload } from '@/src/types';

/**
 * Update profile information (name, bio, phone, avatar_url)
 * Handles avatar file upload if provided
 * Used by: EditProfileForm component
 */
export async function updateProfileInfoAction(
  prevState: UpdateProfileInfoState,
  formData: FormData
): Promise<UpdateProfileInfoState> {
  const full_name = formData.get('full_name') as string;
  const bio = formData.get('bio') as string;
  const phone = formData.get('phone') as string;
  const avatarFile = formData.get('avatar') as File;

  try {
    // Build profile update object
    const profileUpdate: ProfileUpdatePayload = {
      full_name: full_name || null,
      bio: bio || null,
      phone: phone || null,
    };

    // If user selected a new avatar file, upload it first
    if (avatarFile && avatarFile.size > 0) {
      // Validate file type
      if (!avatarFile.type.startsWith('image/')) {
        return { error: 'Avatar file must be an image' };
      }

      // Validate file size (max 5MB)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return { error: 'Avatar image must be less than 5MB' };
      }

      // Upload avatar
      const avatarFormData = new FormData();
      avatarFormData.append('avatar', avatarFile);
      
      const uploadResponse = await uploadAvatarServer(avatarFormData);

      if (!uploadResponse?.ok) {
        return { error: 'Failed to upload avatar image' };
      }

      const uploadResult = await uploadResponse.json();
      profileUpdate.avatar_url = uploadResult.url; // Add new avatar URL to update
    }
    // If no new avatar file, don't update avatar_url field (keeps existing one in DB)

    // Update profile with provided data only
    const res = await updateProfileServer(profileUpdate);

    if (!res || !res.ok) {
      const data = res ? await res.json() : {};
      const errorMessage = data.message || data.error || 'Failed to update profile';
      return { error: errorMessage };
    }

    // Revalidate the profile page to show updated data
    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('[UpdateProfileInfo] Error:', error);
    return { error: 'Failed to update profile. Please try again.' };
  }
}
