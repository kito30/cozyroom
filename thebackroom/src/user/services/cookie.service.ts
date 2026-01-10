import { Injectable } from '@nestjs/common';
import type { Response } from 'express';

@Injectable()
export class CookieService {
    setAuthCookies(
        res: Response,
        accessToken: string,
        refreshToken: string,
        expiresIn: number
    ): void {
        console.log('[CookieService] Setting auth cookies, expiresIn:', expiresIn);
        
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: expiresIn * 1000,
            path: '/',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/',
        });
        
        console.log('[CookieService] Cookies queued for response');
    }
}
