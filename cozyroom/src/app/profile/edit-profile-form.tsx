'use client';

import { useActionState, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProfileAction, type UpdateProfileState } from './update-profile.action';
import { uploadAvatar } from './upload-avatar';
import { CameraIcon } from '@heroicons/react/24/outline';

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
  const [state, formAction] = useActionState<UpdateProfileState, FormData>(
    updateProfileAction,
    null
  );
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarUrlInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('avatar', file);

    const result = await uploadAvatar(formData);

    setIsUploading(false);

    if (result.error) {
      setUploadError(result.error);
      setAvatarPreview(profile.avatar_url || null);
    } else if (result.url && avatarUrlInputRef.current) {
      // Set the URL in the hidden input
      avatarUrlInputRef.current.value = result.url;
    }
  };

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
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="h-24 w-24 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-4xl font-bold text-slate-900 shadow-lg shadow-emerald-500/30 ring-4 ring-slate-800/50 overflow-hidden">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Profile"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              profile.email.charAt(0).toUpperCase()
            )}
          </div>
          
          {/* Upload overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
          >
            <CameraIcon className="w-8 h-8 text-white" />
          </button>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* Hidden URL input for form submission */}
          <input
            ref={avatarUrlInputRef}
            type="hidden"
            name="avatar_url"
            defaultValue={profile.avatar_url || ''}
          />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-200">Profile Picture</h3>
          <p className="text-sm text-slate-400 mb-2">
            {isUploading ? 'Uploading...' : 'Click the avatar to upload a new image'}
          </p>
          
          {uploadError && (
            <p className="text-sm text-red-400 mt-1">{uploadError}</p>
          )}
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800/80 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CameraIcon className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Choose Image'}
          </button>
          
          <p className="text-xs text-slate-500 mt-2">Max size: 5MB • PNG, JPG, GIF</p>
        </div>
      </div>

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
