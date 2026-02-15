import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';
import type { ChatMessage, CreateChatMessage, Room, RoomMember } from '../types/chat';

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

    /**
     * Get all rooms that the current user is a member of
     */
    async getUserRooms(token: string | undefined, userId: string): Promise<Room[]> {
        try {
            const supabase = this.getClient(token);

            const { data: rows, error } = await supabase
                .from('room_members')
                .select('room_id, rooms(id, name, created_at)')
                .eq('user_id', userId);

            if (error) {
                throw new InternalServerErrorException('Failed to fetch user room memberships');
            }

            if (!rows || rows.length === 0) {
                return [];
            }

            return rows
                .map((row: { room_id: string; rooms: Room | Room[] | null }) => {
                    const r = row.rooms;
                    return Array.isArray(r) ? r[0] ?? null : r;
                })
                .filter((room): room is Room => room != null);
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            throw new InternalServerErrorException('An unexpected error occurred while fetching user rooms');
        }
    }

    /**
     * Get members of a room (user id, email, full_name, avatar_url from profiles)
     */
    async getRoomMembers(token: string | undefined, roomId: string): Promise<RoomMember[]> {
        try {
            const supabase = this.getClient(token);

            const { data: members, error: membersError } = await supabase
                .from('room_members')
                .select('user_id')
                .eq('room_id', roomId);

            if (membersError || !members?.length) {
                return [];
            }

            const userIds = members.map((m: { user_id: string }) => m.user_id);
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, email, full_name, avatar_url')
                .in('id', userIds);

            if (profilesError || !profiles?.length) {
                return [];
            }

            return profiles as RoomMember[];
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to fetch room members');
        }
    }

    /**
     * Create a new room and add the creator as a member
     */
    async createRoom(
        token: string | undefined,
        userId: string,
        roomName: string
    ): Promise<Room> {
        try {
            const supabase = this.getClient(token);

            // Create the room
            const roomResponse = await supabase
                .from('rooms')
                .insert({ name: roomName })
                .select('*')
                .single();

            const room = roomResponse.data as Room | null;
            const roomError = roomResponse.error;

            if (roomError || !room) {
                console.error('[ChatService.createRoom] Supabase error:', roomError);
                throw new InternalServerErrorException(
                    `Failed to create room: ${roomError?.message ?? 'Unknown error'}`,
                );
            }

            // Add creator as a member of the room
            const memberResponse = await supabase
                .from('room_members')
                .insert({
                    room_id: room.id,
                    user_id: userId,
                });

            if (memberResponse.error) {
                console.error('[ChatService.createRoom] Failed to add creator as member:', memberResponse.error);
                // Try to clean up the room if adding member fails
                await supabase.from('rooms').delete().eq('id', room.id);
                throw new InternalServerErrorException('Failed to add creator as room member');
            }

            return room;
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            console.error('[ChatService.createRoom] Unexpected error:', error);
            throw new InternalServerErrorException('An unexpected error occurred while creating room');
        }
    }
}

