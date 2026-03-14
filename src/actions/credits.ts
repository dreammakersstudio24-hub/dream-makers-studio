'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient, createAdminClient } from '@/utils/supabase/server'

export async function addTestCredits() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    return { error: 'Not logged in' }
  }

  const supabaseAdmin = createAdminClient()
  
  // Fetch current credits
  const { data: metadata, error: fetchError } = await supabaseAdmin
    .from('users_metadata')
    .select('credits')
    .eq('id', user.id)
    .single()

  const currentCredits = metadata?.credits || 0
  const newCredits = currentCredits + 100

  const { error: updateError } = await supabaseAdmin
    .from('users_metadata')
    .upsert({ id: user.id, credits: newCredits })

  if (updateError) {
    return { error: 'Failed to add test credits' }
  }

  revalidatePath('/app/dashboard')
  revalidatePath('/app/generate')
  
  return { success: true }
}
