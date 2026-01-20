import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.cookies['access_token'] as string | undefined;

        if (!token) {
            throw new UnauthorizedException('Not authenticated');
        }

        try {
            const user = await this.userService.getAuth(token);
            request['user'] = user;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
