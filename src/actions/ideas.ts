'use server'

import { createServerSupabaseClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addGenerationIdea(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  const promptIdea = formData.get('prompt_idea') as string
  
  if (!promptIdea) {
    throw new Error("Missing prompt idea")
  }

  const supabaseAdmin = createAdminClient()

  const { error: dbError } = await supabaseAdmin
    .from('generation_ideas')
    .insert({
      prompt_idea: promptIdea,
      is_active: true,
    })

  if (dbError) {
    throw new Error(`Database insert failed: ${dbError.message}`)
  }

  revalidatePath('/admin/ideas')
}

export async function toggleIdeaStatus(id: string, currentStatus: boolean) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const supabaseAdmin = createAdminClient()

  const { error } = await supabaseAdmin
    .from('generation_ideas')
    .update({ is_active: !currentStatus })
    .eq('id', id)
  
  if (error) {
    console.error(`Toggle status failed: ${error.message}`)
    throw new Error(error.message)
  }

  revalidatePath('/admin/ideas')
}

export async function deleteGenerationIdea(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const supabaseAdmin = createAdminClient()

  const { error } = await supabaseAdmin
    .from('generation_ideas')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error(`Delete failed: ${error.message}`)
    throw new Error(error.message)
  }

  revalidatePath('/admin/ideas')
}
