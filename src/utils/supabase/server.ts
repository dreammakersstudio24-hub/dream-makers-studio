import { createClient } from '@supabase/supabase-js';
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const getEnv = (name: string) => {
  const value = process.env[name];
  if (!value && typeof window === 'undefined') {
    console.warn(`Environment variable ${name} is missing.`);
  }
  return value || '';
};

// Create a unified super admin client for backend/API use only
export const createAdminClient = () => {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) {
    throw new Error('Supabase Admin Client failed: Missing URL or Service Role Key');
  }
  return createClient(url, key);
};

// Create an authenticated server client for server components
export async function createServerSupabaseClient() {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (!url || !key) {
    throw new Error('Supabase Server Client failed: Missing URL or Anon Key');
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
