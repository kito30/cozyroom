import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        // Check for access_token cookie (set by Next.js after login)
        const token = request.cookies['access_token'] as string | undefined;

        if (!token) {
            throw new UnauthorizedException('Not authenticated');
        }

        try {
            // Validate token and attach user to request
            const user = await this.userService.getAuth(token);
            request['user'] = user; // Attach user for use in controller
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
