import { Body, Controller, Post, Get, Patch, Req, UseGuards, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../guards/auth.guard';

interface AuthenticatedRequest extends Request {
    user: User;
}

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post('login')
    async login(
        @Body() body: { email: string; password: string }
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
            
            // Return tokens in response - Next.js will handle setting cookies
            return {
                ok: loginResponse.ok,
                user: loginResponse.user,
                access_token: loginResponse.access_token,
                refresh_token: loginResponse.refresh_token,
                expires_in: loginResponse.expires_in,
            };
        } catch (error: unknown) {
            // Log error for debugging
            console.error('[Login Controller] Error:', error);
            // Re-throw to let NestJS handle the response
            if (error instanceof Error) {
                throw error;
            }
            throw new BadRequestException('An unexpected error occurred');
        }
    }

    @Post('signup')
    async signup(
        @Body() body: { email: string; password: string; confirm_password: string }
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
            
            // Return tokens in response if available - Next.js will handle setting cookies
            return {
                ok: signUpResponse.ok,
                user: signUpResponse.user,
                requiresConfirmation: signUpResponse.requiresConfirmation || false,
                ...(signUpResponse.access_token && {
                    access_token: signUpResponse.access_token,
                    refresh_token: signUpResponse.refresh_token,
                    expires_in: signUpResponse.expires_in,
                }),
            };
            
        } catch (error: unknown) {
            // Log error for debugging
            console.error('[SignUp Controller] Error:', error);
            // Re-throw to let NestJS handle the response
            if (error instanceof Error) {
                throw error;
            }
            throw new BadRequestException('An unexpected error occurred');
        }
    }
    @Get('auth')
    async checkAuth(@Req() req: Request) {
        // Soft check endpoint - always returns 200, with user or null
        // Used by frontend to check auth state without throwing errors
        const accessToken = req.cookies['access_token'] as string | undefined;
        const refreshToken = req.cookies['refresh_token'] as string | undefined;
        
        if(accessToken) {
            try {
                const user = await this.userService.getAuth(accessToken);
                return { user };
            } catch {
                //ignore
            }
        }
        
        if(refreshToken) {
            try {
                const tokens = await this.userService.refreshToken(refreshToken);

                const user = await this.userService.getAuth(tokens.access_token);

                return {
                    user,
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    expires_in: tokens.expires_in,
                }
            }
            catch {
                return { user: null };
            }
        }
        return { user: null };
    }
    @Get('profile')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req: AuthenticatedRequest) {
        const token = req.cookies['access_token'] as string;
        const profile = await this.userService.getProfile(token);
        
        return {
            profile,
        };
    }

    @Patch('profile')
    @UseGuards(AuthGuard)
    async updateProfile(
        @Req() req: AuthenticatedRequest,
        @Body() body: {
            full_name?: string | null;
            bio?: string | null;
            phone?: string | null;
            avatar_url?: string | null;
        }
    ) {
        const token = req.cookies['access_token'] as string;
        const user = req.user; // User attached by AuthGuard

        const updatedProfile = await this.userService.updateProfile(
            token,
            user.id,
            body
        );

        return {
            profile: updatedProfile,
        };
    }

    @Post('refresh')
    async refresh(@Req() req: Request): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
        const refreshToken = req.cookies['refresh_token'] as string | undefined;
        if (!refreshToken) {
            throw new BadRequestException('Refresh token is required');
        }
        const tokens = await this.userService.refreshToken(refreshToken);
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_in: tokens.expires_in,
        };
    }

    @Post('avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(
        @Req() req: AuthenticatedRequest,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException('No file provided');
        }

        const token = req.cookies['access_token'] as string;
        const user = req.user;

        const result = await this.userService.uploadAvatar(token, user.id, file);

        return result;
    }
}