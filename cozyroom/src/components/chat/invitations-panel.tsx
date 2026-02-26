'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getInvitationsClient, acceptInvitationClient } from '@/src/app/services/api/user.api.client';
import type { RoomInvitation } from '@/src/types';

type AcceptStatus = 'idle' | 'accepting' | 'accepted' | 'error';

export default function InvitationsPanel() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<RoomInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptStatus, setAcceptStatus] = useState<Record<string, AcceptStatus>>({});
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    let active = true;
    getInvitationsClient().then((data) => {
      if (!active) return;
      setInvitations(data.filter((inv) => inv.status === 'pending'));
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const handleAccept = async (invitation: RoomInvitation) => {
    setAcceptStatus((prev) => ({ ...prev, [invitation.id]: 'accepting' }));

    const result = await acceptInvitationClient(invitation.id);

    if (result.ok) {
      setAcceptStatus((prev) => ({ ...prev, [invitation.id]: 'accepted' }));
      // Navigate to the room after a short delay
      setTimeout(() => {
        router.push(`/chat/${invitation.room_id}`);
        router.refresh();
      }, 800);
    } else {
      setAcceptStatus((prev) => ({ ...prev, [invitation.id]: 'error' }));
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visible = invitations.filter((inv) => !dismissed.has(inv.id));

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <BellIcon className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-400">Invitations</span>
        </div>
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (visible.length === 0) return null;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <BellIcon className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-semibold text-emerald-400">
          {visible.length} pending {visible.length === 1 ? 'invitation' : 'invitations'}
        </span>
      </div>

      <ul className="space-y-2">
        {visible.map((inv) => {
          const status = acceptStatus[inv.id] ?? 'idle';

          return (
            <li
              key={inv.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-slate-800/50 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-200 truncate">
                  You&apos;ve been invited to a room
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(inv.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {status === 'error' && (
                  <p className="text-xs text-red-400 mt-0.5">Failed to accept — try again</p>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Accept */}
                <button
                  onClick={() => { void handleAccept(inv); }}
                  disabled={status === 'accepting' || status === 'accepted'}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition
                    ${status === 'accepted'
                      ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                      : status === 'accepting'
                      ? 'bg-slate-700/50 text-slate-500 cursor-wait'
                      : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                  {status === 'accepted' ? 'Joined!' : status === 'accepting' ? '…' : 'Accept'}
                </button>

                {/* Dismiss */}
                {status !== 'accepted' && status !== 'accepting' && (
                  <button
                    onClick={() => handleDismiss(inv.id)}
                    className="rounded-lg p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition"
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
