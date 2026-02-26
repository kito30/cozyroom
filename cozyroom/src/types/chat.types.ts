/**
 * Chat message with sender info
 */
export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_name?: string | null;
  sender_avatar?: string | null;
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
 * Chat room
 */
export interface Room {
  id: string;
  name: string;
  created_at: string;
}

/**
 * User in a chat room (for sidebar)
 */
export interface RoomMember {
  id: string;
  full_name: string | null;
  avatar_url?: string | null;
}

/**
 * Room invitation
 */
export interface RoomInvitation {
  id: string;
  room_id: string;
  inviter_id: string;
  invitee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}
