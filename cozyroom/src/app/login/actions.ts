'use server'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
import type { LoginResponse } from '@/src/types/login_response';
import { getApiUrl } from '@/src/config/api';

export type LoginState = { error?: string | string[] } | null;

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Basic validation
  if (!email || !password) {
    return { error: 'Email and password are required' };
  }
  let res: Response;
  let data: LoginResponse; 
  try {
    res = await fetch(getApiUrl('login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({ email, password }),
    });
    data = await res.json();
  } catch (error) {
    console.error('[LoginAction] Error:', error);
    return { error: 'Failed to connect to server. Please try again.' };
  }
  const cookieStore = await cookies();
  
  // Set Access Token (Short lived)
  if (data.access_token) {
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production', // HTTPS only
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour 
    });
  }
  
  // Set Refresh Token (Long lived)
  if (data.refresh_token) {
    cookieStore.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });
  }
  if (!res.ok) {
    const errorMessage = data.message || data.error || 'Invalid email or password';
    console.error('[LoginAction] Login failed:', errorMessage);
    return { error: errorMessage };
  }

  // Backend handles cookie setting, just redirect
  redirect('/profile'); 
}
