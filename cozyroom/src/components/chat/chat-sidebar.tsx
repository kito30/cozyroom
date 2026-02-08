'use client';

import Image from 'next/image';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import type { RoomMember } from '@/src/types';

interface ChatSidebarProps {
  roomName: string;
  members: RoomMember[];
}

export default function ChatSidebar({ roomName, members }: ChatSidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-l border-slate-800/70 bg-slate-950/50 backdrop-blur flex flex-col">
      {/* Room name */}
      <div className="p-4 border-b border-slate-800/70">
        <h2 className="text-sm font-semibold text-slate-50 truncate">{roomName}</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </p>
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center gap-2 mb-3">
          <UserGroupIcon className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            In this room
          </span>
        </div>
        <ul className="space-y-1">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-800/50 transition"
            >
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-xs font-bold text-slate-900 shrink-0 overflow-hidden">
                {member.avatar_url ? (
                  <Image
                    src={member.avatar_url}
                    alt=""
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (member.full_name || member.email).charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {member.full_name || 'Anonymous'}
                </p>
                <p className="text-xs text-slate-500 truncate">{member.email}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
