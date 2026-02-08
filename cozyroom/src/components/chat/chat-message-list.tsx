'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { ChatMessage } from '@/src/types';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 py-12">
          <p className="text-sm">No messages yet</p>
          <p className="text-xs mt-1">Send a message to start the conversation</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="flex gap-3 group">
            <div className="h-9 w-9 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-sm font-bold text-slate-900 shrink-0 overflow-hidden">
              {msg.sender_avatar ? (
                <Image
                  src={msg.sender_avatar}
                  alt=""
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                msg.sender_name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-slate-200">{msg.sender_name}</span>
                <span className="text-xs text-slate-500" suppressHydrationWarning>
                  {formatTime(msg.created_at)}
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-0.5 whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
}
