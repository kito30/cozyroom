'use server';

import { uploadAvatarServer } from '@/src/app/services/api';
import type { AvatarUploadResult } from '@/src/types';

/**
 * Upload avatar file to storage
 * Used by: AvatarUpload component
 * Returns public URL of uploaded image
 */
export async function uploadAvatarAction(formData: FormData): Promise<AvatarUploadResult> {
  try {
    const file = formData.get('avatar') as File;
    
    if (!file || file.size === 0) {
      return { error: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { error: 'File must be an image' };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'Image must be less than 5MB' };
    }

    // Upload via backend API
    const url = await uploadAvatarServer(formData);

    if (!url) {
      console.error('[UploadAvatar] Upload failed');
      return { error: 'Failed to upload image' };
    }

    return { url };
  } catch (error) {
    console.error('[UploadAvatar] Error:', error);
    return { error: 'Failed to upload image' };
  }
}
