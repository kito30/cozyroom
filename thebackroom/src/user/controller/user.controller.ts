import { Body, Controller, Headers, Post, BadRequestException, UnauthorizedException, Get } from '@nestjs/common';
import { createSupabaseClient } from 'src/utils/supabase/client';
import { checkAuth } from 'src/auth/auth.helper';

@Controller()
export class UserController {
    private supabase = createSupabaseClient()

    @Post('login')
    async login (@Body() body: {email: string; password: string}) {
        const { email, password } = body;

        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new BadRequestException(error.message ?? 'Invalid credentials');
        }

        return data;
    }
    @Get('auth')
    async profile(@Headers('authorization') auth: string) {
        const token = auth?.replace('Bearer ', '');
        const user = await checkAuth(token);
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }
        return {email: user.email, id: user.id};

    }
        
}