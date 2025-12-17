'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { LoginResponse } from '@/src/types/login_response';
export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  let res: Response;
  let data: LoginResponse; 
  try {
    res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    data = await res.json();
  } catch {
    // Return error state instead of redirecting
    return { error: 'Failed to connect to server. Please try again.' };
  }
  if (!res.ok) {
    const errorMessage = data.message || data.error || 'Invalid email or password';
    return { error: errorMessage };
  }
  const cookieStore = await cookies();
  
  if (data.access_token) {
      cookieStore.set('token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: data.expires_in, 
        path: '/',
      });
  }
  if (data.refresh_token) {
      cookieStore.set('refresh_token', data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, 
        path: '/',
      });
  }
  redirect('/profile'); 
}