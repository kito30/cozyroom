export interface ChatMessage {
    id: string;
    room_id: string;
    sender_id: string;
    sender_name: string;
    sender_avatar?: string | null;
    content: string;
    created_at: string;
}

