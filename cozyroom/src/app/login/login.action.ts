'use server'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
import type { LoginResponse } from '@/src/types/login_response';
import { loginServer } from '@/src/app/services/user.service';

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

  let res: Response | null;
  let data: LoginResponse; 
  try {
    res = await loginServer(email, password);
    if (!res) {
      return { error: 'Failed to connect to server. Please try again.' };
    }
    data = await res.json();
  } catch (error) {
    console.error('[LoginAction] Error:', error);
    return { error: 'Failed to connect to server. Please try again.' };
  }

  // Check if login was successful FIRST
  if (!res.ok) {
    const errorMessage = data.message || data.error || 'Invalid email or password';
    console.error('[LoginAction] Login failed:', errorMessage);
    return { error: errorMessage };
  }

  // Only set cookies if login was successful
  const cookieStore = await cookies();
  
  // Set Access Token (Short lived)
  if (data.access_token) {
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: data.expires_in || 3600,
    });
  }

  if (data.refresh_token) {
    cookieStore.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  redirect('/profile'); 
}
