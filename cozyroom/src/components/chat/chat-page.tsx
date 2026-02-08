'use client';

import { useState, useCallback } from 'react';
import ChatMessageList from './chat-message-list';
import ChatInput from './chat-input';
import ChatSidebar from './chat-sidebar';
import type { ChatMessage, RoomMember } from '@/src/types';
import { useProfileOptional } from '@/src/providers/ProfileProvider';

// Mock data for UI demo - replace with API calls later
const MOCK_ROOM_NAME = 'General';
const MOCK_MEMBERS: RoomMember[] = [
  { id: '1', full_name: 'Alice', avatar_url: null, email: 'alice@example.com' },
  { id: '2', full_name: 'Bob', avatar_url: null, email: 'bob@example.com' },
  { id: '3', full_name: 'Carol', avatar_url: null, email: 'carol@example.com' },
];
// Fixed timestamps to avoid hydration mismatch (Date.now() differs between server/client)
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    room_id: 'room-1',
    sender_id: '1',
    sender_name: 'Alice',
    sender_avatar: null,
    content: 'Hey everyone! Welcome to the chat.',
    created_at: '2025-02-06T14:30:00.000Z',
  },
  {
    id: '2',
    room_id: 'room-1',
    sender_id: '2',
    sender_name: 'Bob',
    sender_avatar: null,
    content: 'Thanks! Glad to be here.',
    created_at: '2025-02-06T14:35:00.000Z',
  },
  {
    id: '3',
    room_id: 'room-1',
    sender_id: '1',
    sender_name: 'Alice',
    sender_avatar: null,
    content: 'How is everyone doing today?',
    created_at: '2025-02-06T14:40:00.000Z',
  },
];

export default function ChatPage() {
  const profile = useProfileOptional();
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [members] = useState<RoomMember[]>(MOCK_MEMBERS);

  const handleSend = useCallback(
    (content: string) => {
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        room_id: 'room-1',
        sender_id: profile?.email ?? 'anonymous',
        sender_name: profile?.full_name || profile?.email || 'You',
        sender_avatar: profile?.avatar_url ?? null,
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
    },
    [profile]
  );

  return (
    <div className="flex h-[calc(100vh-56px)] min-h-0 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <ChatMessageList messages={messages} />
        {/* Input */}
        <ChatInput onSend={handleSend} />
      </div>

      {/* Right sidebar - users in room */}
      <ChatSidebar roomName={MOCK_ROOM_NAME} members={members} />
    </div>
  );
}
