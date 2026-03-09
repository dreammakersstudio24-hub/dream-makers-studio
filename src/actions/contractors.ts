'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateContractorProfile(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  // First, verify they have an active subscription record
  const { data: existingRecord } = await supabase
    .from('contractors')
    .select('id, is_active')
    .eq('user_id', user.id)
    .single()

  if (!existingRecord) {
     throw new Error('Subscription not found. Please subscribe first.')
  }

  const payload = {
    company_name: formData.get('company_name') as string,
    contact_email: formData.get('contact_email') as string,
    phone_number: formData.get('phone_number') as string,
    country: formData.get('country') as string,
    city: formData.get('city') as string,
    description: formData.get('description') as string,
  }

  const { error } = await supabase
    .from('contractors')
    .update(payload)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`)
  }

  revalidatePath('/contractors/dashboard')
  revalidatePath('/directory')
}
