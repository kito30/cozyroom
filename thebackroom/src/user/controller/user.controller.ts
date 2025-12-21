import { Body, Controller, Post, BadRequestException, UnauthorizedException, Get, Req } from '@nestjs/common';
import type { Request} from 'express'
import { createSupabaseClient } from 'src/utils/supabase/client';
import { UserService } from '../services/user.service';
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    private supabase = createSupabaseClient();
    @Post('login')
    async login (
        @Body() body: {email: string; password: string}) {
        const { email, password } = body;

        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new BadRequestException(error.message ?? 'Invalid credentials');
        }
        const { access_token, refresh_token, expires_in } = data.session;
        return { ok: true, user: data.user, access_token: access_token, refresh_token: refresh_token, expires_in: expires_in }
    }
    @Get('auth')
    async profile(@Req() req: Request) {
        const token = req.cookies['token'] as string | undefined;
        console.log('Token:', token);
        
        if (!token) {
            throw new UnauthorizedException('No session')
        }

        const { data, error } = await this.supabase.auth.getUser(token);
        if (error) {
            throw new UnauthorizedException('Invalid token')
        }

        return { user: data.user }
    }
        
}