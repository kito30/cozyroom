import { Injectable } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';
@Injectable()
export class UserService {
    async checkAuth(token: string) {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            return null;
        }
        return data.user;
    }
}

