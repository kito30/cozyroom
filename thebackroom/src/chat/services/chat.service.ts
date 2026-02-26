import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';
import type { ChatMessage, CreateChatMessage, Room, RoomMember, RoomInvitation } from '../types/chat';
import { SupabaseClient } from '@supabase/supabase-js';

const MESSAGES_DEFAULT_LIMIT = 50;

@Injectable()
export class ChatService {

    private getClient(token?: string) {
        return createSupabaseClient(token);
    }

    /**
     * Fetch chat messages for a room, joined with sender profile (full_name, avatar_url).
     */
    async getMessages(token: string | undefined, limit = MESSAGES_DEFAULT_LIMIT, roomId?: string): Promise<ChatMessage[]> {
        try {
            const supabase = this.getClient(token);

            let query = supabase
                .from('messages')
                .select('*, profiles!sender_id(full_name, avatar_url)')
                .order('created_at', { ascending: true })
                .limit(limit);

            if (roomId) {
                query = query.eq('room_id', roomId);
            }

            const messagesResponse = await query;
            if (messagesResponse.error) {
                throw new InternalServerErrorException('Failed to fetch messages');
            }

            const rows = messagesResponse.data as Array<{
                id: string;
                room_id: string;
                sender_id: string;
                content: string;
                created_at: string;
                profiles: { full_name: string | null; avatar_url: string | null } | null;
            }>;

            if (rows.length === 0) {
                return [];
            }

            return rows.map((row) => ({
                id: row.id,
                room_id: row.room_id,
                sender_id: row.sender_id,
                content: row.content,
                created_at: row.created_at,
                sender_name: row.profiles?.full_name ?? null,
                sender_avatar: row.profiles?.avatar_url ?? null,
            })) as ChatMessage[];
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }

            throw new InternalServerErrorException('An unexpected error occurred while fetching messages');
        }
    }
    
    /**
     * Create a new chat message in the database. Returns the message with sender_name and sender_avatar from profiles.
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

            const row = response.data as {
                id: string;
                room_id: string;
                sender_id: string;
                content: string;
                created_at: string;
            };

            const profileRes = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', row.sender_id)
                .single();

            const profile = profileRes.data as { full_name: string | null; avatar_url: string | null } | null;

            return {
                ...row,
                sender_name: profile?.full_name ?? null,
                sender_avatar: profile?.avatar_url ?? null,
            } as ChatMessage;
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
    async checkInviterIsMember(
        supabase: SupabaseClient,
        roomId: string,
        inviterId: string,
    ): Promise<boolean> {
        const { data, error } = await supabase
            .from('room_members')
            .select('user_id')
            .eq('room_id', roomId)
            .eq('user_id', inviterId)
            .maybeSingle();
        if (error) return false;
        if (data == null) return false;
        return true;
    }
    async checkInviteeIsMember(
        supabase: SupabaseClient,
        roomId: string,
        inviteeId: string,
    ): Promise<boolean> {
        const { data, error } = await supabase
            .from('room_members')
            .select('user_id')
            .eq('room_id', roomId)
            .eq('user_id', inviteeId)
            .maybeSingle();
        if (error) return false;
        if(data == null) return false;
        return true;
    }
    async createInvitation(
        token: string,
        roomId: string,
        inviterId: string,
        inviteeId: string,
    ): Promise<RoomInvitation> {
        try {
            const supabase = this.getClient(token);

            const isInviterMember = await this.checkInviterIsMember(supabase, roomId, inviterId);
            if (!isInviterMember) {
                throw new BadRequestException('Inviter is not a member of the room');
            }

            const isInviteeMember = await this.checkInviteeIsMember(supabase, roomId, inviteeId);
            if (isInviteeMember) {
                throw new BadRequestException('Invitee is already a member of the room');
            }

            // Check if an invite has been sent or not
            const { data: existing } = await supabase
                .from('room_invitations')
                .select('id')
                .eq('room_id', roomId)
                .eq('invitee_id', inviteeId)
                .eq('status', 'pending')
                .maybeSingle();

            if (existing) {
                throw new BadRequestException('A pending invitation already exists for this user');
            }

            const invitation = await supabase
                .from('room_invitations')
                .insert({
                    room_id: roomId,
                    inviter_id: inviterId,
                    invitee_id: inviteeId,
                    status: 'pending',
                })
                .select('*')
                .single();

            if (invitation.error) {
                console.error('[ChatService.createInvitation] Supabase error:', invitation.error);
                throw new InternalServerErrorException('Failed to create invitation');
            }

            return invitation.data as RoomInvitation;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred while creating invitation');
        }
    }

    async getInvitationCurrentUser(
        token: string,
        invitee_id: string,
    ) {
        try {
            const supabase = this.getClient(token);
            const invitations = await supabase
                .from('room_invitations')
                .select('*')
                .eq('invitee_id', invitee_id);
            if(invitations.error) {
                throw new InternalServerErrorException('Failed to get invitations');
            }
            return invitations.data as RoomInvitation[];
        }
        catch (error) {
            if (error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred while getting invitations');
        }
    }
    async acceptInvitation(
        token: string,
        invitationId: string,
    ): Promise<RoomInvitation> {
        try {
            const supabase = this.getClient(token);

            const fetchResponse = await supabase
                .from('room_invitations')
                .select('*')
                .eq('id', invitationId)
                .eq('status', 'pending')
                .maybeSingle();

            if (fetchResponse.error) {
                throw new InternalServerErrorException('Failed to fetch invitation');
            }
            if (!fetchResponse.data) {
                throw new BadRequestException('Invitation not found or already resolved');
            }
            const existing = fetchResponse.data as RoomInvitation;

            const updateResponse = await supabase
                .from('room_invitations')
                .update({ status: 'accepted' })
                .eq('id', invitationId)
                .select('*')
                .single();

            if (updateResponse.error || !updateResponse.data) {
                throw new InternalServerErrorException('Failed to accept invitation');
            }
            const updated = updateResponse.data as RoomInvitation;

            const { error: memberError } = await supabase
                .from('room_members')
                .insert({
                    room_id: existing.room_id,
                    user_id: existing.invitee_id,
                });

            if (memberError) {
                throw new InternalServerErrorException('Failed to add invitee to room members');
            }

            return updated;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
                throw error;
            }
            throw new InternalServerErrorException('An unexpected error occurred while accepting invitation');
        }
    }
}

