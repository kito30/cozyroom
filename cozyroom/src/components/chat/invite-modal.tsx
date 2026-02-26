'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { XMarkIcon, MagnifyingGlassIcon, UserPlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { searchUsersClient, sendInvitationClient } from '@/src/app/services/api/user.api.client';
import type { UserSearchResult } from '@/src/app/services/api/user.api.client';

interface InviteModalProps {
  roomId: string;
  onClose: () => void;
}

type InviteStatus = 'idle' | 'sending' | 'sent' | 'error';

export default function InviteModal({ roomId, onClose }: InviteModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<Record<string, InviteStatus>>({});
  const [inviteError, setInviteError] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const users = await searchUsersClient(q.trim());
    setResults(users);
    setSearching(false);
  }, []);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { void runSearch(val); }, 350);
  };

  const handleInvite = async (user: UserSearchResult) => {
    setInviteStatus((prev) => ({ ...prev, [user.id]: 'sending' }));
    setInviteError((prev) => { const next = { ...prev }; delete next[user.id]; return next; });

    const result = await sendInvitationClient(roomId, user.id);

    if (result.ok) {
      setInviteStatus((prev) => ({ ...prev, [user.id]: 'sent' }));
    } else {
      setInviteStatus((prev) => ({ ...prev, [user.id]: 'error' }));
      setInviteError((prev) => ({ ...prev, [user.id]: result.error ?? 'Failed to send invitation' }));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/60 shadow-2xl flex flex-col max-h-[80vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/70 shrink-0">
            <h2 className="text-base font-semibold text-slate-50">Invite someone</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search input */}
          <div className="px-5 py-3 border-b border-slate-800/70 shrink-0">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Search by name or email…"
                className="w-full rounded-lg bg-slate-800/60 border border-slate-700/50 pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto px-3 py-2 min-h-[120px]">
            {searching && (
              <p className="text-center text-sm text-slate-500 py-6">Searching…</p>
            )}

            {!searching && query.trim().length >= 2 && results.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-6">No users found</p>
            )}

            {!searching && query.trim().length < 2 && (
              <p className="text-center text-sm text-slate-500 py-6">Type at least 2 characters to search</p>
            )}

            {!searching && results.length > 0 && (
              <ul className="space-y-1">
                {results.map((user) => {
                  const status = inviteStatus[user.id] ?? 'idle';
                  const error = inviteError[user.id];
                  const initial = (user.full_name ?? '?').charAt(0).toUpperCase();

                  return (
                    <li
                      key={user.id}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-slate-800/50 transition"
                    >
                      {/* Avatar */}
                      <div className="h-9 w-9 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0 overflow-hidden">
                        {user.avatar_url ? (
                          <Image src={user.avatar_url} alt="" width={36} height={36} className="h-full w-full object-cover" />
                        ) : initial}
                      </div>

                      {/* Name */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200 truncate">
                          {user.full_name ?? 'Anonymous'}
                        </p>
                        {status === 'error' && error && (
                          <p className="text-xs text-red-400 mt-0.5 truncate">{error}</p>
                        )}
                      </div>

                      {/* Invite button */}
                      <button
                        onClick={() => { void handleInvite(user); }}
                        disabled={status === 'sending' || status === 'sent'}
                        className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition
                          ${status === 'sent'
                            ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                            : status === 'error'
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : status === 'sending'
                            ? 'bg-slate-700/50 text-slate-500 cursor-wait'
                            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          }`}
                      >
                        {status === 'sent' ? (
                          <><CheckIcon className="w-3.5 h-3.5" /> Invited</>
                        ) : status === 'sending' ? (
                          'Sending…'
                        ) : status === 'error' ? (
                          'Retry'
                        ) : (
                          <><UserPlusIcon className="w-3.5 h-3.5" /> Invite</>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
