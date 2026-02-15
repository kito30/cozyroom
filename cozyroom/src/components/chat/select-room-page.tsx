'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { getUserRooms, createRoom } from '@/src/app/services/api';
import type { Room } from '@/src/types';

export default function SelectRoomPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [createName, setCreateName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserRooms().then((data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = createName.trim();
    if (!name || creating) return;

    setCreating(true);
    setError(null);
    try {
      const room = await createRoom(name);
      if (room) {
        setRooms((prev) => [room, ...prev]);
        setCreateName('');
        router.push(`/chat/${room.id}?name=${encodeURIComponent(room.name)}`);
      } else {
        setError('Failed to create room');
      }
    } catch {
      setError('Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] p-6 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              Select a chat room
            </h1>
            <p className="text-sm text-slate-400">
              Choose an existing room or create a new one
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateRoom} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="New room name"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              disabled={creating}
            />
            <button
              type="submit"
              disabled={!createName.trim() || creating}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 font-medium text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5" />
              Create
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-rose-400">{error}</p>
          )}
        </form>

        {loading ? (
          <div className="text-center text-slate-500 py-8">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center">
            <ChatBubbleLeftRightIcon className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3 text-slate-400">No rooms yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Create a room above to get started
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {rooms.map((room) => (
              <li key={room.id}>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/chat/${room.id}?name=${encodeURIComponent(room.name)}`
                    )
                  }
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-3 text-left transition hover:border-slate-700 hover:bg-slate-800/50"
                >
                  <span className="font-medium text-slate-200 truncate">
                    {room.name}
                  </span>
                  <ArrowRightIcon className="h-5 w-5 shrink-0 text-slate-500" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
