import { Controller, Get, Post, Patch, Query, Req, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';

const MESSAGES_DEFAULT_LIMIT = 50;
const MESSAGES_MAX_LIMIT = 200;
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { ChatService } from '../services/chat.service';
import { AuthGuard } from 'src/user/guards/auth.guard';
import type { CreateChatMessage } from '../types/chat';

interface AuthenticatedRequest extends Request {
    user: User;
}


@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
    ) {}

    /**
     * Get messages for a specific room
     * Optional query param: ?limit=50
     */
    @Get('rooms/:roomId/messages')
    @UseGuards(AuthGuard)
    async getMessages(
        @Req() req: AuthenticatedRequest,
        @Param('roomId') roomId: string,
        @Query('limit') limit?: string,
    ) {
        const token = req.cookies?.['access_token'] as string | undefined;

        let numericLimit = Number(limit);
        if (Number.isNaN(numericLimit) || numericLimit <= 0) {
            numericLimit = MESSAGES_DEFAULT_LIMIT;
        }
        numericLimit = Math.min(numericLimit, MESSAGES_MAX_LIMIT);
        const messages = await this.chatService.getMessages(token, numericLimit, roomId);
        return { messages };
    }

    /**
     * Create a new message in a room
     */
    @Post('rooms/:roomId/messages')
    @UseGuards(AuthGuard)
    async createMessage(
        @Req() req: AuthenticatedRequest,
        @Param('roomId') roomId: string,
        @Body() body: { content: string },
    ) {
        const token = req.cookies?.['access_token'] as string | undefined;
        const user = req.user;

        if (!body?.content || typeof body.content !== 'string') {
            throw new BadRequestException('Content is required');
        }

        const message: CreateChatMessage = {
            room_id: roomId,
            sender_id: user.id,
            content: body.content,
        };

        const createdMessage = await this.chatService.createMessage(token, message);
        return { message: createdMessage };
    }

    /**
     * Get all rooms that the current user is a member of
     */
    @Get('rooms')
    @UseGuards(AuthGuard)
    async getUserRooms(@Req() req: AuthenticatedRequest) {
        const token = req.cookies?.['access_token'] as string | undefined;
        const user = req.user;

        const rooms = await this.chatService.getUserRooms(token, user.id);
        return rooms;
    }

    /**
     * Get members of a room
     */
    @Get('rooms/:roomId/members')
    @UseGuards(AuthGuard)
    async getRoomMembers(
        @Req() req: AuthenticatedRequest,
        @Param('roomId') roomId: string,
    ) {
        const token = req.cookies?.['access_token'] as string | undefined;
        const members = await this.chatService.getRoomMembers(token, roomId);
        return { members };
    }

    /**
     * Create a new room
     */
    @Post('rooms')
    @UseGuards(AuthGuard)
    async createRoom(
        @Req() req: AuthenticatedRequest,
        @Body() body: { name: string },
    ) {
        const token = req.cookies?.['access_token'] as string | undefined;
        const user = req.user;

        if (!body?.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
            throw new BadRequestException('Room name is required');
        }

        const room = await this.chatService.createRoom(token, user.id, body.name.trim());
        return { room };
    }
    /**
     * Send an invitation to a user to join a room.
     * The authenticated user must already be a member of the room.
     * Body: { inviteeId: string }
     */
    @Post('rooms/:roomId/invite')
    @UseGuards(AuthGuard)
    async createInvitation(
        @Req() req: AuthenticatedRequest,
        @Param('roomId') roomId: string,
        @Body() body: { inviteeId: string },
    ) {
        const token = req.cookies?.['access_token'] as string;
        const inviterId = req.user.id;

        if (!body?.inviteeId || typeof body.inviteeId !== 'string') {
            throw new BadRequestException('inviteeId is required');
        }

        const invitation = await this.chatService.createInvitation(token, roomId, inviterId, body.inviteeId);
        return { invitation };
    }

    /**
     * Get all pending invitations for the currently authenticated user.
     */
    @Get('invitations')
    @UseGuards(AuthGuard)
    async getMyInvitations(@Req() req: AuthenticatedRequest) {
        const token = req.cookies?.['access_token'] as string;
        const invitations = await this.chatService.getInvitationCurrentUser(token, req.user.id);
        return { invitations };
    }

    /**
     * Accept a pending invitation by its ID.
     * The authenticated user must be the invitee.
     */
    @Patch('invitations/:invitationId/accept')
    @UseGuards(AuthGuard)
    async acceptInvitation(
        @Req() req: AuthenticatedRequest,
        @Param('invitationId') invitationId: string,
    ) {
        const token = req.cookies?.['access_token'] as string;
        const invitation = await this.chatService.acceptInvitation(token, invitationId);
        return { invitation };
    }
}

