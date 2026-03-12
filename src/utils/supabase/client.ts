import { createBrowserClient as createSSRBrowserClient } from '@supabase/ssr'

export const createBrowserClient = () => {
  return createSSRBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'
  )
}
