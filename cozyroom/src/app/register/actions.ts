'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getApiUrl } from '@/src/config/api';

export type RegisterState = { 
  error?: string | string[];
  requiresConfirmation?: boolean;
} | null;

interface User {
  id: string;
  email: string;
  [key: string]: unknown;
}

interface SignUpResponse {
  ok: boolean;
  user: User;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  message?: string;
  error?: string;
}

export async function registerAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirm_password = formData.get('confirm_password') as string;

  // Basic validation
  if (!email || !password || !confirm_password) {
    return { error: 'All fields are required' };
  }

  if (password !== confirm_password) {
    return { error: 'Passwords do not match' };
  }

  let res: Response;
  let data: SignUpResponse;
  try {
    res = await fetch(getApiUrl('signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({ email, password, confirm_password }),
    });
    data = await res.json();
  } catch (error) {
    return { error: 'Failed to connect to server. Please try again.' };
  }

  // Check if signup was successful
  if (!res.ok) {
    const errorMessage = data.message || data.error || 'Failed to create account';
    return { error: errorMessage };
  }

  // Only set cookies if signup was successful and tokens are provided
  if (data.access_token && data.refresh_token) {
    const cookieStore = await cookies();
    
    // Set Access Token (Short lived)
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: data.expires_in || 3600,
    });

    // Set Refresh Token (Long lived)
    cookieStore.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 Days
    });

    // Redirect to profile
    redirect('/profile');
  }

  // If we get here, account was created but no tokens (shouldn't happen if requiresConfirmation is false)
  return { error: 'Account created successfully! Please log in.' };
}
