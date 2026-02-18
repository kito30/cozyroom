'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ChatMessageList from './chat-message-list';
import ChatInput from './chat-input';
import ChatSidebar from './chat-sidebar';
import type { ChatMessage, RoomMember } from '@/src/types';
import { getMessages, postMessage, getRoomMembers } from '@/src/app/services/api/user.api.server';
import { createSupabaseClient } from '@/src/components/supabase/client';
import { useAuth } from '@/src/providers/AuthProvider';
import { useProfileOptional } from '@/src/providers/ProfileProvider';

const supabase = createSupabaseClient();

interface ChatPageProps {
  roomId: string;
  roomName?: string;
}

export default function ChatPage({ roomId, roomName }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<RoomMember[]>([]);
  const { user } = useAuth();
  const profile = useProfileOptional();

  const senderName = profile?.full_name ?? 'Unknown';

  const senderAvatar = profile?.avatar_url ?? null;

  // Load initial room members
  useEffect(() => {
    getRoomMembers(roomId).then(setMembers);
  }, [roomId, senderName, senderAvatar, user?.id]);

  // Load initial messages
  useEffect(() => {
    let active = true;

    const loadChatHistory = async () => {
      const initial = await getMessages(roomId);
      // prevent overwriting messages
      if (active) setMessages(initial);
    };

    loadChatHistory();
    return () => { active = false; };
  }, [roomId, senderName, senderAvatar, user?.id]);

  // Subscribe to realtime inserts for this room
  useEffect(() => {
    const channel = supabase
      .channel(`room-messages-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            room_id: string;
            sender_id: string;
            content: string;
            created_at: string;
          };

          const isSelf = row.sender_id === user?.id;
          const newMessage: ChatMessage = {
            id: row.id,
            room_id: row.room_id,
            sender_id: row.sender_id,
            content: row.content,
            created_at: row.created_at,
            sender_name: isSelf ? senderName : null,
            sender_avatar: isSelf ? senderAvatar : null,
          };
          
          setMessages((prev) =>
            prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, senderName, senderAvatar, user?.id]);

  const displayRoomName = roomName ?? `Room ${roomId.slice(0, 8)}`;

  const handleSend = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const created = await postMessage(roomId, trimmed);
      if (!created) return;

      const newMessage: ChatMessage = {
        id: created.id,
        room_id: created.room_id,
        sender_id: created.sender_id,
        content: created.content,
        created_at: created.created_at,
        sender_name: senderName,
        sender_avatar: senderAvatar,
      };

      setMessages((prev) =>
        prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage]
      );
    },
    [roomId, senderName, senderAvatar]
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
