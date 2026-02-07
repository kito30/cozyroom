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
      
      const avatarUrl = await uploadAvatarServer(avatarFormData);

      if (!avatarUrl) {
        return { error: 'Failed to upload avatar image' };
      }

      profileUpdate.avatar_url = avatarUrl;
    }
    // Update profile with provided data only
    const profile = await updateProfileServer(profileUpdate);

    if (!profile) {
      return { error: 'Failed to update profile' };
    }

    // Revalidate the profile page to show updated data
    revalidatePath('/profile');

    return { success: true };
  } catch (error) {
    console.error('[UpdateProfileInfo] Error:', error);
    return { error: 'Failed to update profile. Please try again.' };
  }
}
