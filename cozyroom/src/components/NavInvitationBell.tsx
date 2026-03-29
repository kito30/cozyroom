'use client';

import { useState, useEffect } from 'react';
import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/providers/AuthProvider';
import { getInvitationsClient, acceptInvitationClient } from '@/src/app/services/api/user.api.client';
import type { RoomInvitation } from '@/src/types';

type AcceptStatus = 'idle' | 'accepting' | 'accepted' | 'error';

export default function NavInvitationBell() {
    const { user } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [invitations, setInvitations] = useState<RoomInvitation[]>([]);
    const [acceptStatus, setAcceptStatus] = useState<Record<string, AcceptStatus>>({});
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!user) return;
        let active = true;
        getInvitationsClient().then((data) => {
            if (!active) return;
            setInvitations(data.filter((inv) => inv.status === 'pending'));
        });
        return () => { active = false; };
    }, [user]);

    const visible = invitations.filter((inv) => !dismissed.has(inv.id));

    const handleAccept = async (inv: RoomInvitation) => {
        setAcceptStatus((prev) => ({ ...prev, [inv.id]: 'accepting' }));
        const result = await acceptInvitationClient(inv.id);
        if (result.ok) {
            setAcceptStatus((prev) => ({ ...prev, [inv.id]: 'accepted' }));
            setTimeout(() => {
                setOpen(false);
                router.push(`/chat/${inv.room_id}`);
                router.refresh();
            }, 700);
        } else {
            setAcceptStatus((prev) => ({ ...prev, [inv.id]: 'error' }));
        }
    };

    const handleDismiss = (id: string) => {
        setDismissed((prev) => new Set(prev).add(id));
    };

    if (!user) return null;

    return (
        <div className="relative">
            {/* Bell button */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="relative rounded-lg p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
                <BellIcon className="w-5 h-5" />
                {visible.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-900">
                        {visible.length}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-20"
                        onClick={() => setOpen(false)}
                    />

                    <div className="absolute right-0 top-full mt-2 z-30 w-80 rounded-xl border border-slate-700/60 bg-slate-900 shadow-2xl">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/70">
                            <span className="text-sm font-semibold text-slate-200">Invitations</span>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded p-1 text-slate-500 hover:text-slate-300 transition"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {visible.length === 0 ? (
                                <p className="px-4 py-6 text-center text-sm text-slate-500">
                                    No pending invitations
                                </p>
                            ) : (
                                <ul className="p-2 space-y-1">
                                    {visible.map((inv) => {
                                        const status = acceptStatus[inv.id] ?? 'idle';
                                        return (
                                            <li
                                                key={inv.id}
                                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-800/50 transition"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm text-slate-200">
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
                                                        <p className="text-xs text-red-400 mt-0.5">Failed — try again</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0">
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
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
