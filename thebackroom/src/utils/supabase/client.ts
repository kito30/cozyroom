import { createClient } from '@supabase/supabase-js'

export const createSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    return createClient(
        supabaseUrl!, 
        supabaseKey!);
}