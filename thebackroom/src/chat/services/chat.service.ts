import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';
import type { ChatMessage } from '../types/chat';

@Injectable()
export class ChatService {
    private getClient(token?: string) {
        return createSupabaseClient(token);
    }

    /**
     * Fetch chat messages from the database.
     * Assumes a `messages` table exists in Supabase.
     */
    async getMessages(token: string | undefined, limit = 50): Promise<ChatMessage[]> {
        try {
            const supabase = this.getClient(token);

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(limit);

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
    
    async createMessage(
        token: string | undefined,
        message: ChatMessage
    ): Promise<{status:number, statusText: string}> {
        try {
            const supabase = this.getClient(token);

            const response = await supabase
                .from('messages')
                .insert(message)
                .select('*')
                .single();

            if (response.error || !response.data || response.status !== 201) {
                console.error('[ChatService.createMessage] Supabase error:', response.error);
                throw new InternalServerErrorException(
                    `Failed to create message: ${response.statusText ?? response.error?.message ?? 'Unknown error'}`,
                );
            }

            return {status: response.status, statusText: response.statusText};
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            throw new InternalServerErrorException('An unexpected error occurred while creating message');
        }
    }
}

