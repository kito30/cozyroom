import { BadRequestException } from '@nestjs/common';

/**
 * Validates email format and requirements
 * @param email - Email address to validate
 * @throws BadRequestException if email is invalid
 */
export function validateEmail(email: string): void {
    if (!email || typeof email !== 'string') {
        throw new BadRequestException('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        throw new BadRequestException('Invalid email format');
    }

    if (email.length > 255) {
        throw new BadRequestException('Email is too long (maximum 255 characters)');
    }
}

/**
 * Validates password strength and requirements
 * @param password - Password to validate
 * @param isSignUp - Whether this is for signup (stricter requirements)
 * @throws BadRequestException if password is invalid
 */
export function validatePassword(password: string, isSignUp: boolean = false): void {
    if (!password || typeof password !== 'string') {
        throw new BadRequestException('Password is required');
    }

    if (password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters long');
    }

    if (password.length > 72) {
        throw new BadRequestException('Password is too long (maximum 72 characters)');
    }

    if (isSignUp) {
        // Additional validation for signup
        if (!/(?=.*[a-z])/.test(password)) {
            throw new BadRequestException('Password must contain at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            throw new BadRequestException('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*\d)/.test(password)) {
            throw new BadRequestException('Password must contain at least one number');
        }
    }
}

/**
 * Validates password confirmation matches password
 * @param password - Original password
 * @param confirmPassword - Password confirmation
 * @throws BadRequestException if passwords don't match
 */
export function validatePasswordConfirmation(password: string, confirmPassword: string): void {
    if (!confirmPassword || typeof confirmPassword !== 'string') {
        throw new BadRequestException('Password confirmation is required');
    }

    if (password !== confirmPassword) {
        throw new BadRequestException('Passwords do not match');
    }
}

/**
 * Normalizes email (trim and lowercase)
 * @param email - Email to normalize
 * @returns Normalized email
 */
export function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
}
