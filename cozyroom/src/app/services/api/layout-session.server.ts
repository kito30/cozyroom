'use server';

import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/src/types';
import { checkAuthServer, getProfileServer } from './user.api.server';

export type LayoutSession = {
  user: User | null;
  profile: Profile | null;
};

/**
 * Fetch all layout-level data in one call (user, profile, etc.).
 * Use in RootLayout to keep layout clean when wiring multiple providers.
 */
export async function getLayoutSession(): Promise<LayoutSession> {
  const user = await checkAuthServer();

  const profile = user ? await getProfileServer() : null;

  return { user, profile };
}
