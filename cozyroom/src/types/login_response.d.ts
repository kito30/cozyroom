import { User } from '@supabase/supabase-js'
type LoginResponse = {
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