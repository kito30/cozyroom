
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
    // Helper method to get appropriate Supabase client
    private getClient(token?: string) {
        return createSupabaseClient(token);
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        try {
            // Input validation
            validateEmail(email);
            validatePassword(password);

            const normalizedEmail = normalizeEmail(email);

            const { data, error } = await this.getClient().auth.signInWithPassword({
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

            const { data, error } = await this.getClient().auth.signUp({
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
        if (!token) {
            throw new UnauthorizedException('No session');
        }
        
        const { data, error } = await this.getClient().auth.getUser(token);
        
        if (error || !data.user) {
            throw new UnauthorizedException('Invalid token');
        }
        
        return data.user;
    }

    async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token required');
        }

        const { data, error } = await this.getClient().auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error || !data?.session) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const { access_token, refresh_token, expires_in } = data.session;

        return {
            access_token,
            refresh_token,
            expires_in: expires_in ?? 3600,
        };
    }
    async getProfile(token: string): Promise<UserWithProfile> {
        if (!token) {
            throw new UnauthorizedException('No session');
        }

        const response = await this.getClient(token)
            .from('profiles')
            .select('*')
            .single();

        if (response.error || !response.data) {
            throw new BadRequestException('Profile not found');
        }

        return response.data as UserWithProfile;
    }

    async updateProfile(
        token: string,
        userId: string,
        updates: {
            full_name?: string | null;
            bio?: string | null;
            phone?: string | null;
            avatar_url?: string | null;
        }
    ): Promise<UserWithProfile> {
        if (!token) {
            throw new UnauthorizedException('No session');
        }

        // Validate inputs
        if (updates.full_name && updates.full_name.length > 100) {
            throw new BadRequestException('Display name is too long (maximum 100 characters)');
        }

        if (updates.bio && updates.bio.length > 500) {
            throw new BadRequestException('Bio is too long (maximum 500 characters)');
        }

        if (updates.phone && updates.phone.length > 20) {
            throw new BadRequestException('Phone number is too long (maximum 20 characters)');
        }

        if (updates.avatar_url && updates.avatar_url.length > 500) {
            throw new BadRequestException('Avatar URL is too long');
        }

        // Update profile in Supabase
        const response = await this.getClient(token)
            .from('profiles')
            .update({
                full_name: updates.full_name,
                bio: updates.bio,
                phone: updates.phone,
                avatar_url: updates.avatar_url,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (response.error) {
            console.error('[UpdateProfile] Supabase error:', response.error);
            throw new BadRequestException('Failed to update profile');
        }

        if (!response.data) {
            throw new BadRequestException('Profile not found');
        }

        return response.data as UserWithProfile;
    }

    async uploadAvatar(
        token: string,
        userId: string,
        file: Express.Multer.File
    ): Promise<{ url: string }> {
        if (!token) {
            throw new UnauthorizedException('No session');
        }

        // Validate file type
        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('File must be an image');
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            throw new BadRequestException('Image must be less than 5MB');
        }

        const supabase = this.getClient(token);
        const fileExt = file.originalname.split('.').pop() || 'jpg';
        const fileName = `${userId}.${fileExt}`;

        // Delete old avatar if exists (to prevent accumulation of different extensions)
        try {
            await supabase.storage.from('avatars').remove([fileName]);
        } catch {
            // Ignore errors - file might not exist
        }

        // Upload new avatar
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (uploadError) {
            console.error('[UploadAvatar] Supabase error:', uploadError);
            throw new BadRequestException('Failed to upload avatar');
        }

        // Get public URL
        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);

        // Add cache-busting parameter
        const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

        return { url: publicUrl };
    }
}

