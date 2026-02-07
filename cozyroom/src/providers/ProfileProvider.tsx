'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Profile } from '@/src/types';

const ProfileContext = createContext<Profile | null>(null);

type ProfileProviderProps = { profile: Profile | null; children: ReactNode };

export function ProfileProvider({ children, profile }: ProfileProviderProps) {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

/** Use when profile is required (e.g. profile page). Throws if no profile. */
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

/** Use when profile is optional (e.g. navbar). Returns null if no profile. */
export function useProfileOptional(): Profile | null {
  return useContext(ProfileContext);
}
