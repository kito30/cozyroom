import type { User } from '@supabase/supabase-js';

export interface AuthDetails {
    id: string;
    email: string;
    updated_at: string;
    created_at: string;
}

export interface LoginResponse {
    ok: boolean;
    user: User;
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface SignUpResponse {
    ok: boolean;
    user: User;
    requiresConfirmation?: boolean;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
}

export interface UserWithProfile {
    id: string;
    email: string;
    created_at: string;
    updated_at?: string;
    full_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    phone?: string | null;
}