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
        
        try {
            const loginResponse = await this.userService.login(email, password);
            
            // Set httpOnly cookies in the response
            if (loginResponse.access_token && loginResponse.refresh_token) {
                this.cookieService.setAuthCookies(
                    res,
                    loginResponse.access_token,
                    loginResponse.refresh_token,
                    loginResponse.expires_in
                );
                
                // Return user info (NOT tokens - they're in cookies)
                return {
                    ok: true,
                    user: loginResponse.user,
                };
            }
            
            res.status(400);
            return {
                ok: false,
                error: 'Failed to generate session tokens',
            };
        } catch (error) {
            res.status(401);
            return {
                ok: false,
                error: error instanceof Error ? error.message : 'Invalid credentials',
            };
        }
    }

    @Get('auth')
    async profile(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const token = req.cookies['token'] as string | undefined;
        
        if (!token) {
            res.status(401);
            return { user: null };
        }
        
        try {
            const user = await this.userService.getAuth(token);
            const profile = await this.userService.getProfile(user.id);
            
            return { 
                user: profile ? { ...user, ...profile } : user 
            };
        } catch (error) {
            res.status(401);
            return { user: null };
        }
    }
}