'use client';

import { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface AvatarSectionProps {
  email: string;
  initialAvatarUrl?: string | null;
}

export default function AvatarSection({ email, initialAvatarUrl }: AvatarSectionProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    // Show preview immediately (upload happens when form is submitted)
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <div className="h-24 w-24 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-4xl font-bold text-slate-900 shadow-lg shadow-emerald-500/30 ring-4 ring-slate-800/50 overflow-hidden">
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Profile"
              width={96}
              height={96}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            email.charAt(0).toUpperCase()
          )}
        </div>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <CameraIcon className="w-8 h-8 text-white" />
        </button>
        
        {/* File input - will be submitted with the form */}
        <input
          ref={fileInputRef}
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-200">Profile Picture</h3>
        <p className="text-sm text-slate-400 mb-2">
          Click the avatar to select a new image
        </p>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800/80 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition"
        >
          <CameraIcon className="w-4 h-4" />
          Choose Image
        </button>
        
        <p className="text-xs text-slate-500 mt-2">Max size: 5MB • PNG, JPG, GIF</p>
        <p className="text-xs text-slate-400 mt-1">Image will upload when you click &ldquo;Save Changes&rdquo;</p>
      </div>
    </div>
  );
}
