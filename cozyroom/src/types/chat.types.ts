/**
 * Chat message with sender info
 */
export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

/**
 * Chat message data for creating a new message (without id and created_at)
 */
export interface CreateChatMessage {
  room_id: string;
  sender_id: string;
  content: string;
}

/**
 * User in a chat room (for sidebar)
 */
export interface RoomMember {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
  email: string;
}
