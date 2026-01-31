/**
 * Profile update form state
 * Used by: EditProfileForm component with useActionState
 */
export type UpdateProfileInfoState = {
  error?: string | string[];
  success?: boolean;
} | null;

/**
 * Profile data structure
 */
export interface Profile {
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
}

/**
 * Profile update payload
 */
export interface ProfileUpdatePayload {
  full_name?: string | null;
  bio?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

/**
 * Avatar upload result
 */
export interface AvatarUploadResult {
  url?: string;
  error?: string;
}
