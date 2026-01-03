import { Body, Controller, Post, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CookieService } from '../services/cookie.service';

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
        else {
            return {
                ok: false,
                error: 'Failed to login',
            };
        }
        return {
            ok: loginResponse.ok,
            user: loginResponse.user,
        };
    }

    @Get('auth')
    async profile(@Req() req: Request) {
        const token = req.cookies['token'] as string | undefined;
        if (!token) {
            return { user: null };
        }
        
        const user = await this.userService.getAuth(token);
        const profile = await this.userService.getProfile(user.id);
        
        return { 
            user: profile ? { ...user, ...profile } : user 
        };
    }
}