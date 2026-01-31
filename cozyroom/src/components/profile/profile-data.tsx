'use client';

import { use } from 'react';
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Image from 'next/image';

interface ProfileData {
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  phone?: string | null;
}

interface ProfileDataProps {
  profilePromise: Promise<ProfileData>;
}

/**
 * This component suspends while loading profile data
 * Must be wrapped in a Suspense boundary
 */
export default function ProfileData({ profilePromise }: ProfileDataProps) {
  // use() hook will suspend the component until the promise resolves
  const profile = use(profilePromise);
  
  return (
    <div className="relative border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-5xl font-bold text-slate-900 shadow-2xl shadow-emerald-500/30 ring-4 ring-slate-800/50">
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                profile.email.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50 ring-4 ring-slate-950">
              <UserCircleIcon className="w-6 h-6 text-slate-900" />
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-50 mb-1">
              {profile.full_name || 'Anonymous User'}
            </h1>
            <p className="text-slate-400 mb-2">{profile.email}</p>
            {profile.bio && (
              <p className="text-sm text-slate-300 max-w-2xl">
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
