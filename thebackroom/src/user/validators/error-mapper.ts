/**
 * Maps Supabase error codes to user-friendly messages
 * @param error - Supabase error object
 * @param defaultMessage - Default message if error can't be mapped
 * @returns User-friendly error message
 */
export function getSupabaseErrorMessage(
    error: { status?: number; message?: string } | null | undefined,
    defaultMessage: string
): string {
    if (!error) return defaultMessage;

    const status = error.status;
    const message = error.message || '';

    // Handle Supabase specific error codes
    switch (status) {
        case 400:
            if (message.includes('Invalid login credentials')) {
                return 'Invalid email or password';
            }
            if (message.includes('Email not confirmed')) {
                return 'Please verify your email before logging in';
            }
            return message || 'Invalid request';

        case 401:
            return 'Invalid email or password';

        case 422:
            if (message.includes('Password')) {
                return 'Password does not meet requirements';
            }
            if (message.includes('Email')) {
                return 'Invalid email format';
            }
            return message || 'Validation failed';

        case 429:
            return 'Too many requests. Please try again later';

        default:
            return message || defaultMessage;
    }
}
