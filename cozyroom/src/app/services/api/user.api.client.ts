import type { ChatMessage, RoomMember, RoomInvitation } from '@/src/types';
import type { User } from '@supabase/supabase-js';

export interface UserSearchResult {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
}

export interface AuthResult {
    user: User | null;
    access_token: string | null;
    refresh_token: string | null;
}

export const checkAuthClient = async (): Promise<AuthResult> => {
    try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) return { user: null, access_token: null, refresh_token: null };
        const data = await res.json() as { user?: User; access_token?: string; refresh_token?: string };
        return {
            user: data.user ?? null,
            access_token: data.access_token ?? null,
            refresh_token: data.refresh_token ?? null,
        };
    } catch {
        return { user: null, access_token: null, refresh_token: null };
    }
};

export const getMessagesClient = async (roomId: string): Promise<ChatMessage[]> => {
    try {
        const res = await fetch(`/api/chat/rooms/${roomId}/messages`, { credentials: 'include' });
        if (!res.ok) return [];
        const data = await res.json() as { messages?: ChatMessage[] };
        return data.messages ?? [];
    } catch {
        return [];
    }
};

export const postMessageClient = async (roomId: string, content: string): Promise<ChatMessage | null> => {
    try {
        const res = await fetch(`/api/chat/rooms/${roomId}/messages`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        if (!res.ok) return null;
        const data = await res.json() as { message?: ChatMessage };
        return data.message ?? null;
    } catch {
        return null;
    }
};

export const getRoomMembersClient = async (roomId: string): Promise<RoomMember[]> => {
    try {
        const res = await fetch(`/api/chat/rooms/${roomId}/members`, { credentials: 'include' });
        if (!res.ok) return [];
        const data = await res.json() as { members?: RoomMember[] };
        return Array.isArray(data.members) ? data.members : [];
    } catch {
        return [];
    }
};

export const searchUsersClient = async (query: string, limit = 20): Promise<UserSearchResult[]> => {
    try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
            credentials: 'include',
        });
        if (!res.ok) return [];
        const data = await res.json() as { users?: UserSearchResult[] };
        return data.users ?? [];
    } catch {
        return [];
    }
};

export const getInvitationsClient = async (): Promise<RoomInvitation[]> => {
    try {
        const res = await fetch('/api/chat/invitations', { credentials: 'include' });
        if (!res.ok) return [];
        const data = await res.json() as { invitations?: RoomInvitation[] };
        return data.invitations ?? [];
    } catch {
        return [];
    }
};

export const acceptInvitationClient = async (invitationId: string): Promise<{ ok: boolean; error?: string }> => {
    try {
        const res = await fetch(`/api/chat/invitations/${invitationId}/accept`, {
            method: 'PATCH',
            credentials: 'include',
        });
        const data = await res.json().catch(() => ({})) as { message?: string };
        if (!res.ok) {
            return { ok: false, error: data.message ?? 'Failed to accept invitation' };
        }
        return { ok: true };
    } catch {
        return { ok: false, error: 'Failed to accept invitation' };
    }
};

export const sendInvitationClient = async (roomId: string, inviteeId: string): Promise<{ ok: boolean; error?: string }> => {
    try {
        const res = await fetch(`/api/chat/rooms/${roomId}/invite`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inviteeId }),
        });
        const data = await res.json().catch(() => ({})) as { message?: string };
        if (!res.ok) {
            return { ok: false, error: data.message ?? 'Failed to send invitation' };
        }
        return { ok: true };
    } catch {
        return { ok: false, error: 'Failed to send invitation' };
    }
};
