import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ChatService } from '../services/chat.service';
import { AuthGuard } from 'src/user/guards/auth.guard';

interface AuthenticatedRequest extends Request {
    cookies: Record<string, string>;
}

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
    ) {}

    /**
     * Optional query param: ?limit=50
     */
    @Get('messages')
    @UseGuards(AuthGuard)
    async getMessages(
        @Req() req: AuthenticatedRequest,
        @Query('limit') limit?: string,
    ) {
        const cap = 200;    
        const token = req.cookies?.['access_token'] as string | undefined;

        let numericLimit = Number(limit); // casting idk
        if (Number.isNaN(numericLimit) || numericLimit <= 0) {
            numericLimit = 50;
        }
        // Hard cap to prevent abuse
        numericLimit = Math.min(numericLimit, cap);
        const messages = await this.chatService.getMessages(token, numericLimit);
        return { messages };
    }
}

