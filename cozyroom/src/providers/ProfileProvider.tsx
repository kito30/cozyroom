'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Profile } from '@/src/types';

const ProfileContext = createContext<Profile | null>(null);

/** Props: values that exist in the Profile type (email, full_name, avatar_url, bio, phone) */
type ProfileProviderProps = { profile: Profile; children: ReactNode };

export function ProfileProvider({ children, profile }: ProfileProviderProps) {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
