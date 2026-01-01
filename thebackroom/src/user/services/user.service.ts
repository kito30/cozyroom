import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';
import type { UserWithProfile, LoginResponse } from '../types/user';
import { User } from '@supabase/supabase-js';

@Injectable()
export class UserService {
    private supabase = createSupabaseClient();

    async login(email: string, password: string): Promise<LoginResponse> {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new BadRequestException(error.message ?? 'Invalid credentials');
        }

        const { access_token, refresh_token, expires_in } = data.session;
        
        return {
            ok: true,
            user: data.user,
            access_token,
            refresh_token,
            expires_in,
        };
    }
    async signUp(email: string, password: string): Promise<User> {
        const {data, error} = await this.supabase.auth.signUp({
            email,
            password,
        });
        if(error) {
            throw new BadRequestException(error.message ?? 'Failed to sign up');
        }
        if(!data.user) {
            throw new BadRequestException('User not created');
        }
        return data.user;
    }
    async getAuth(token: string): Promise<User> {
        if(!token) {
            throw new UnauthorizedException('No session');
        }
        const {data, error} = await this.supabase.auth.getUser(token);
        if(error || !data.user) {
            throw new UnauthorizedException('Invalid token');
        }
        return data.user;
    }
    async getProfile(userId: string): Promise<UserWithProfile | null> {
        const respond = await this.supabase
            .from('profile')
            .select('*')
            .eq('id', userId)
            .single();
        if(respond.error || !respond.data) {
            return null;
        }
        return respond.data as UserWithProfile;
    }
}

