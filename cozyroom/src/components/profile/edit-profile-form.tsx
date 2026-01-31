'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfileInfoAction, type UpdateProfileInfoState } from '@/src/app/services/profile';
import AvatarSection from '@/src/components/profile/avatar-section';

interface EditProfileFormProps {
  profile: {
    email: string;
    full_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    phone?: string | null;
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/40 transition hover:shadow-2xl hover:shadow-emerald-500/60 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

export default function EditProfileForm({ profile }: EditProfileFormProps) {


  const [state, formAction] = useActionState<UpdateProfileInfoState, FormData>(
    updateProfileInfoAction,
    null
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Success Message */}
      {state?.success && (
        <div className="flex items-start gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-2.5 text-sm text-emerald-100 shadow-sm shadow-emerald-900/60">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="leading-snug">Profile updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-950/60 px-3.5 py-2.5 text-sm text-red-100 shadow-sm shadow-red-900/60">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.9)]" />
          <span className="leading-snug">
            {Array.isArray(state.error) ? state.error.join(', ') : state.error}
          </span>
        </div>
      )}

      {/* Avatar Preview & Upload */}
      <AvatarSection email={profile.email} initialAvatarUrl={profile.avatar_url} />

      {/* Email (Read-only) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          type="email"
          value={profile.email}
          disabled
          className="w-full rounded-lg border border-slate-700/80 bg-slate-900/50 px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
        />
        <p className="text-xs text-slate-500">Email cannot be changed</p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <label htmlFor="full_name" className="block text-sm font-medium text-slate-200">
          Display Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          placeholder="Your name"
          defaultValue={profile.full_name || ''}
          className="w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm shadow-black/40 outline-none transition focus:border-emerald-400/80 focus:ring-2 focus:ring-emerald-500/70"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-medium text-slate-200">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          placeholder="Tell us about yourself..."
          defaultValue={profile.bio || ''}
          className="w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm shadow-black/40 outline-none transition focus:border-emerald-400/80 focus:ring-2 focus:ring-emerald-500/70 resize-none"
        />
        <p className="text-xs text-slate-500">Brief description for your profile</p>
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-slate-200">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          defaultValue={profile.phone || ''}
          className="w-full rounded-lg border border-slate-700/80 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm shadow-black/40 outline-none transition focus:border-emerald-400/80 focus:ring-2 focus:ring-emerald-500/70"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <SubmitButton />
      </div>
    </form>
  );
}
