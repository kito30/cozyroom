'use server';

import { cookies } from 'next/headers';

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

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return { error: 'Not authenticated' };
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/avatars/${fileName}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      console.error('[UploadAvatar] Upload failed:', await response.text());
      return { error: 'Failed to upload image' };
    }

    // Return the public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${fileName}`;
    
    return { url: publicUrl };
  } catch (error) {
    console.error('[UploadAvatar] Error:', error);
    return { error: 'Failed to upload image' };
  }
}
