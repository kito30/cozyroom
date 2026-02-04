import { User } from '@supabase/supabase-js';

/**
 * Login form state
 * Used by: LoginForm component with useActionState
 */
export type LoginState = {
  error?: string | string[];
  user?: User | null;
} | null;

/**
 * Register form state
 * Used by: RegisterForm component with useActionState
 */
export type RegisterState = {
  error?: string | string[];
  requiresConfirmation?: boolean;
  user?: User | null;
} | null;

/**
 * Login API response
 */
export type LoginResponse = {
  // Success fields
  ok?: boolean;
  user?: User;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;

  // Error fields (NestJS standard error response)
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

/**
 * SignUp API response
 */
export type SignUpResponse = {
  ok: boolean;
  user: User;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  message?: string;
  error?: string;
};
