import { Controller, Get, Post, Query, Req, Param, Body, UseGuards, BadRequestException } from '@nestjs/common';
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
        const cap = 200;    
        const token = req.cookies?.['access_token'] as string | undefined;

        let numericLimit = Number(limit);
        if (Number.isNaN(numericLimit) || numericLimit <= 0) {
            numericLimit = 50;
        }
        // Hard cap to prevent abuse
        numericLimit = Math.min(numericLimit, cap);
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
}

