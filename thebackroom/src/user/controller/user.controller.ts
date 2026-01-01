import { Body, Controller, Post, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from '../services/user.service';

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return await this.userService.login(email, password);
    }

    @Get('auth')
    async profile(@Req() req: Request) {
        const token = req.cookies['token'] as string | undefined;
        const userWithProfile = await this.userService.getUserWithProfile(token || '');
        return { user: userWithProfile };
    }
}