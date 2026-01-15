/**
 * Validation utilities for user authentication
 */
export {
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
    normalizeEmail,
} from './auth.validator';

export { getSupabaseErrorMessage } from './error-mapper';
