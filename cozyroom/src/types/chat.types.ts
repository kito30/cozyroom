/**
 * Chat message with sender info
 */
export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string | null;
  content: string;
  created_at: string;
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
