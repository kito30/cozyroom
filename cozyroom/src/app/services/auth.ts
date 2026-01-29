'use server';

import { cookies } from 'next/headers';
import { logoutServer } from './user.service.server';

export async function logoutAction() {

  await logoutServer();
  
  // Clear cookies
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}
