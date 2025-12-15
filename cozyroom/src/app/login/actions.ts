'use server';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
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
    throw new Error('Failed to connect to server. Please try again.');
  }
  
  if (!res.ok) {
    let errorMessage = 'Invalid email or password';
    try {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorJson.error || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
    } catch {

    }
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`);
  }
  
  await res.json(); // Parse response (contains user/session data)
  // Optionally store token here if needed
  
  redirect('/profile');
}