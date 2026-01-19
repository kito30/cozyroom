import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';
import type { UserWithProfile, LoginResponse, SignUpResponse } from '../types/user';
import { User } from '@supabase/supabase-js';
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
    normalizeEmail,
    getSupabaseErrorMessage,
} from '../validators';

@Injectable()
export class UserService {
    private publicClient = createSupabaseClient();

    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            // Input validation
            validateEmail(email);
            validatePassword(password);

            const normalizedEmail = normalizeEmail(email);

            const { data, error } = await this.publicClient.auth.signInWithPassword({
                email: normalizedEmail,
                password,
            });

            if (error) {
                const errorMessage = getSupabaseErrorMessage(error, 'Invalid email or password');
                
                // Log error for debugging (without sensitive info)
                console.error('[Login] Supabase error:', {
                    status: error.status,
                    message: error.message,
                    email: normalizedEmail,
                });

                throw new BadRequestException(errorMessage);
            }

            if (!data.session) {
                console.error('[Login] No session returned from Supabase');
                throw new InternalServerErrorException('Failed to create session');
            }

            if (!data.user) {
                console.error('[Login] No user returned from Supabase');
                throw new InternalServerErrorException('Failed to retrieve user data');
            }

            const { access_token, refresh_token, expires_in } = data.session;
            
            if (!access_token || !refresh_token) {
                console.error('[Login] Missing tokens in session');
                throw new InternalServerErrorException('Failed to generate authentication tokens');
            }

            return {
                ok: true,
                user: data.user,
                access_token,
                refresh_token,
                expires_in,
            };
        } catch (error) {
            // Re-throw NestJS exceptions as-is
            if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
                throw error;
            }
            
            // Handle unexpected errors
            console.error('[Login] Unexpected error:', error);
            throw new InternalServerErrorException('An unexpected error occurred during login');
        }
    }

    async signUp(email: string, password: string, confirm_password: string): Promise<SignUpResponse> {
        try {
            // Input validation
            validateEmail(email);
            validatePassword(password, true);
            validatePasswordConfirmation(password, confirm_password);

            const normalizedEmail = normalizeEmail(email);

            const { data, error } = await this.publicClient.auth.signUp({
                email: normalizedEmail,
                password,
            });

            if (error) {
                const errorMessage = getSupabaseErrorMessage(error, 'Failed to create account');
                
                // Log error for debugging
                console.error('[SignUp] Supabase error:', {
                    status: error.status,
                    message: error.message,
                    email: normalizedEmail,
                });

                throw new BadRequestException(errorMessage);
            }

            if (!data.user) {
                console.error('[SignUp] No user returned from Supabase');
                throw new InternalServerErrorException('Failed to create user account');
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                console.log('[SignUp] Email confirmation required for:', normalizedEmail);
                return {
                    ok: true,
                    user: data.user,
                    requiresConfirmation: true,
                };
            }

            // If session exists, return tokens for cookie setting
            if (data.session) {
                const { access_token, refresh_token, expires_in } = data.session;
                
                if (access_token && refresh_token) {
                    return {
                        ok: true,
                        user: data.user,
                        requiresConfirmation: false,
                        access_token,
                        refresh_token,
                        expires_in,
                    };
                }
            }

            return {
                ok: true,
                user: data.user,
                requiresConfirmation: false,
            };
        } catch (error) {
            // Re-throw NestJS exceptions as-is
            if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
                throw error;
            }
            
            // Handle unexpected errors
            console.error('[SignUp] Unexpected error:', error);
            throw new InternalServerErrorException('An unexpected error occurred during signup');
        }
    }
    async getAuth(token: string): Promise<User> {
        if(!token) {
            throw new UnauthorizedException('No session');
        }
        const {data, error} = await this.publicClient.auth.getUser(token);
        if(error || !data.user) {
            throw new UnauthorizedException('Invalid token');
        }
        return data.user;
    }

    async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }

        try {
            const { data, error } = await this.publicClient.auth.refreshSession({
                refresh_token: refreshToken,
            });

            if (error || !data?.session) {
                throw new UnauthorizedException('Invalid or expired refresh token');
            }

            const { access_token, refresh_token, expires_in } = data.session;

            if (!access_token || !refresh_token) {
                throw new UnauthorizedException('Failed to refresh tokens');
            }

            return {
                access_token,
                refresh_token,
                expires_in: expires_in ?? 3600,
            };
        } catch (error: unknown) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            console.error('[RefreshToken] Error:', error);
            throw new UnauthorizedException('Failed to refresh token');
        }
    }
    async getProfile(token: string): Promise<UserWithProfile | null> {
        
        const protectedClient = createSupabaseClient(token);
        const respond = await protectedClient
            .from('profiles')
            .select('*')
            .single();
        console.log(respond);
        if(respond.error || !respond.data) {
            return null;
        }
        return respond.data as UserWithProfile;
    }
}

