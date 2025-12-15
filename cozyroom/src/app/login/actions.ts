'use server';
import { redirect } from 'next/navigation';

export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  let res: Response;
  
  try {
    res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    // Return error state instead of redirecting
    return { error: 'Failed to connect to server. Please try again.' };
  }
  
  if (!res.ok) {
    let errorMessage = 'Invalid email or password';
    const errorText = await res.text();
    const errorJson = JSON.parse(errorText);
    errorMessage = errorJson.message || errorJson.error || errorMessage;
    return { error: errorMessage };
  }
  
  await res.json();
  redirect('/profile'); // Only redirect on success
}