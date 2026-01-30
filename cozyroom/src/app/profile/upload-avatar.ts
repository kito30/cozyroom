'use server';

import { uploadAvatarServer } from '../services/user.service.server';

export async function uploadAvatar(formData: FormData): Promise<{ url?: string; error?: string }> {
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
    const response = await uploadAvatarServer(formData);

    if (!response?.ok) {
      const errorText = response ? await response.text() : 'Unknown error';
      console.error('[UploadAvatar] Upload failed:', errorText);
      return { error: 'Failed to upload image' };
    }

    const result = await response.json();
    
    return { url: result.url };
  } catch (error) {
    console.error('[UploadAvatar] Error:', error);
    return { error: 'Failed to upload image' };
  }
}
