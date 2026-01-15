import { Body, Controller, Post, Get, Req, Res, UseGuards, BadRequestException } from '@nestjs/common';
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
        // Validate request body
        if (!body || typeof body !== 'object') {
            throw new BadRequestException('Invalid request body');
        }

        const { email, password } = body;

        if (!email || !password) {
            throw new BadRequestException('Email and password are required');
        }

        try {
            const loginResponse = await this.userService.login(email, password);
            
            // Set cookies using cookie service
            if (loginResponse.access_token && loginResponse.refresh_token) {
                this.cookieService.setAuthCookies(
                    res,
                    loginResponse.access_token,
                    loginResponse.refresh_token,
                    loginResponse.expires_in
                );
            } else {
                console.warn('[Login] Missing tokens in response');
            }
        
            return {
                ok: loginResponse.ok,
                user: loginResponse.user,
            };
        } catch (error: unknown) {
            // Log error for debugging
            console.error('[Login Controller] Error:', error);
            // Re-throw to let NestJS handle the response
            if (error instanceof Error) {
                throw error;
            }
            throw error;
        }
    }

    @Post('signup')
    async signup(
        @Body() body: { email: string; password: string; confirm_password: string },
        @Res({ passthrough: true }) res: Response
    ) {
        // Validate request body
        if (!body || typeof body !== 'object') {
            throw new BadRequestException('Invalid request body');
        }

        const { email, password, confirm_password } = body;

        if (!email || !password || !confirm_password) {
            throw new BadRequestException('Email, password, and password confirmation are required');
        }

        try {
            const signUpResponse = await this.userService.signUp(email, password, confirm_password);
            
            // Set cookies if tokens are available (session created immediately)
            if (signUpResponse.access_token && signUpResponse.refresh_token) {
                this.cookieService.setAuthCookies(
                    res,
                    signUpResponse.access_token,
                    signUpResponse.refresh_token,
                    signUpResponse.expires_in || 3600
                );
            }
            
            // Return response with appropriate message
            if (signUpResponse.ok && signUpResponse.user) {
                return {
                    ok: true,
                    user: signUpResponse.user,
                    requiresConfirmation: signUpResponse.requiresConfirmation || false,
                    message: signUpResponse.requiresConfirmation 
                        ? 'Please check your email to confirm your account'
                        : 'Account created successfully',
                };
            }

            return {
                ok: false,
                message: 'Failed to create account',
            };
        } catch (error: unknown) {
            // Log error for debugging
            console.error('[SignUp Controller] Error:', error);
            // Re-throw to let NestJS handle the response
            if (error instanceof Error) {
                throw error;
            }
            throw error;
        }
    }
    @Get('auth')
    async checkAuth(@Req() req: Request) {
        // Soft check endpoint - always returns 200, with user or null
        // Used by frontend to check auth state without throwing errors
        const token = req.cookies['token'] as string | undefined;
        
        if (!token) {
            return { user: null };
        }
        
        try {
            const user = await this.userService.getAuth(token);
            return { user };
        } catch {
            // Token invalid/expired - return null instead of throwing
            return { user: null };
        }
    }
    @Get('profile')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req: AuthenticatedRequest) {
        // User is already validated by AuthGuard and attached to request
        const token = req.cookies['token'] as string ;
        const profile = await this.userService.getProfile(token);
        
        return {
            profile: profile,
        };
    }
}