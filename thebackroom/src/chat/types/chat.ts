export interface ChatMessage {
    id: string;
    room_id: string;
    sender_id: string;
    content: string;
    created_at: string;
}

export interface CreateChatMessage {
    room_id: string;
    sender_id: string;
    content: string;
}

export interface Room {
    id: string;
    name: string;
    created_at: string;
}

