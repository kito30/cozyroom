'use client';

import { useState, useCallback } from 'react';
import ChatMessageList from './chat-message-list';
import ChatInput from './chat-input';
import ChatSidebar from './chat-sidebar';
import type { ChatMessage, RoomMember } from '@/src/types';
import { useProfileOptional } from '@/src/providers/ProfileProvider';
import { v4 as uuidv4} from 'uuid';

export default function ChatPage() {
  const profile = useProfileOptional();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members] = useState<RoomMember[]>([]);

  const handleSend = useCallback(
    (content: string) => {
      const newMessage: ChatMessage = {
        id: uuidv4(),
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
      <ChatSidebar roomName="General" members={members} />
    </div>
  );
}
