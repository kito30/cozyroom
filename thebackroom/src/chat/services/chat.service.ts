import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';
import type { ChatMessage, CreateChatMessage } from '../types/chat';

@Injectable()
export class ChatService {
    private getClient(token?: string) {
        return createSupabaseClient(token);
    }

    /**
     * Fetch chat messages from the database for a specific room.
     * Assumes a `messages` table exists in Supabase.
     */
    async getMessages(token: string | undefined, limit = 50, roomId?: string): Promise<ChatMessage[]> {
        try {
            const supabase = this.getClient(token);

            let query = supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(limit);

            // Filter by room_id if provided
            if (roomId) {
                query = query.eq('room_id', roomId);
            }

            const { data, error } = await query;

            if (error) {
                console.error('[ChatService.getMessages] Supabase error:', error);
                throw new InternalServerErrorException('Failed to fetch messages');
            }

            return (data ?? []) as ChatMessage[];
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            console.error('[ChatService.getMessages] Unexpected error:', error);
            throw new InternalServerErrorException('An unexpected error occurred while fetching messages');
        }
    }
    
    /**
     * Create a new chat message in the database.
     */
    async createMessage(
        token: string | undefined,
        message: CreateChatMessage
    ): Promise<ChatMessage> {
        try {
            const supabase = this.getClient(token);

            const response = await supabase
                .from('messages')
                .insert(message)
                .select('*')
                .single();

            if (response.error || !response.data) {
                console.error('[ChatService.createMessage] Supabase error:', response.error);
                throw new InternalServerErrorException(
                    `Failed to create message: ${response.error?.message ?? 'Unknown error'}`,
                );
            }

            return response.data as ChatMessage;
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            throw new InternalServerErrorException('An unexpected error occurred while creating message');
        }
    }
}

