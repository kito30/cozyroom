'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ChatMessageList from './chat-message-list';
import ChatInput from './chat-input';
import ChatSidebar from './chat-sidebar';
import type { ChatMessage, RoomMember } from '@/src/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/src/providers/AuthProvider';
import { useProfileOptional } from '@/src/providers/ProfileProvider';
import { getRoomMembers } from '@/src/app/services/api';

interface ChatPageProps {
  roomId: string;
  roomName?: string;
}

export default function ChatPage({ roomId, roomName }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const { user } = useAuth();
  const profile = useProfileOptional();

  useEffect(() => {
    getRoomMembers(roomId).then(setMembers);
  }, [roomId]);

  const senderName = profile?.full_name ?? (user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? user?.email ?? 'Unknown';
  const senderAvatar = profile?.avatar_url ?? null;

  const displayRoomName = roomName ?? `Room ${roomId.slice(0, 8)}`;

  const handleSend = useCallback(
    (content: string) => {
      const newMessage: ChatMessage = {
        id: uuidv4(),
        room_id: roomId,
        sender_id: user?.id ?? '',
        content,
        created_at: new Date().toISOString(),
        sender_name: senderName,
        sender_avatar: senderAvatar,
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    [user?.id, senderName, senderAvatar, roomId]
  );

  return (
    <div className="flex h-[calc(100vh-56px)] min-h-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Back to rooms */}
        <div className="shrink-0 border-b border-slate-800/70 px-4 py-2">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to rooms
          </Link>
        </div>
        {/* Messages */}
        <ChatMessageList messages={messages} />
        {/* Input */}
        <ChatInput onSend={handleSend} />
      </div>

      {/* Right sidebar - users in room */}
      <ChatSidebar roomName={displayRoomName} members={members} />
    </div>
  );
}
