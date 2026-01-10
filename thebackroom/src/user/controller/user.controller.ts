import { Body, Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { User } from '@supabase/supabase-js';
import { UserService } from '../services/user.service';
import { CookieService } from '../services/cookie.service';
import { AuthGuard } from '../guards/auth.guard';

interface AuthenticatedRequest extends Request {
    user: User;
}

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cookieService: CookieService
    ) {}

    @Post('login')
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response
    ) {
        const { email, password } = body;
        const loginResponse = await this.userService.login(email, password);
        
        // Set cookies using cookie service
        if (loginResponse.access_token && loginResponse.refresh_token) {
            this.cookieService.setAuthCookies(
                res,
                loginResponse.access_token,
                loginResponse.refresh_token,
                loginResponse.expires_in
            );
        }
      
        return {
            ok: loginResponse.ok,
            user: loginResponse.user,
        };
    }

    @Get('auth')
    async checkAuth(@Req() req: Request) {
        const token = req.cookies['token'] as string | undefined;
        if (!token) {
            return { user: null };
        }
        const user = await this.userService.getAuth(token);
        return { user };
    }
    @Get('profile')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req: AuthenticatedRequest) {
        // User is already validated by AuthGuard and attached to request
        const user = req.user;
        const profile = await this.userService.getProfile(user.id);
        
        return {
            ...user,
            ...profile,
        };
    }
}