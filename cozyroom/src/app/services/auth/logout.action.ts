'use server';

import { cookies } from 'next/headers';
import { logoutServer } from '@/src/app/services/api';

export async function logoutAction(): Promise<{ ok: boolean }> {
  await logoutServer();
  
  // Clear cookies on the server
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');

  return { ok: true };
}
