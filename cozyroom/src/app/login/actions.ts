'use server';
import { redirect } from 'next/navigation';
export async function loginAction(formData: FormData) {
  console.log(formData);
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  // Validate credentials (call Supabase or your Nest endpoint)
  try {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
          const errorText = await res.text();
          console.error('Login failed:', errorText);
          throw new Error('Invalid credentials');
        }
        
        redirect('/profile');
      } catch (error) {
        console.error('Fetch error:', error);
        throw new Error('Failed to connect to server. Is the backend running?');
      }
}