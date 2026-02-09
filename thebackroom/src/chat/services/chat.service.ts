import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';

@Injectable()
export class ChatService {
    private getClient(token?: string) {
        return createSupabaseClient(token);
    }

    /**
     * Fetch chat messages from the database.
     * Assumes a `messages` table exists in Supabase.
     */
    async getMessages(token: string | undefined, limit = 50) {
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

            return data ?? [];
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            console.error('[ChatService.getMessages] Unexpected error:', error);
            throw new InternalServerErrorException('An unexpected error occurred while fetching messages');
        }
    }
}

