'use client';
import { redirect } from 'next/navigation';
import type { LoginResponse } from '@/src/types/login_response';

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
    res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    data = await res.json();
  } catch (error) {
    console.error('[LoginAction] Error:', error);
    return { error: 'Failed to connect to server. Please try again.' };
  }

  if (!res.ok) {
    const errorMessage = data.message || data.error || 'Invalid email or password';
    console.error('[LoginAction] Login failed:', errorMessage);
    return { error: errorMessage };
  }

  // Backend handles cookie setting, just redirect
  redirect('/profile'); 
}
