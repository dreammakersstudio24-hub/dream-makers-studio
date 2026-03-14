'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  const nextUrl = formData.get('next') as string || '/ai-redesign'

  if (error) {
    redirect(`/login?error=true&next=${encodeURIComponent(nextUrl)}&message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect(nextUrl)
}

export async function signup(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)
  const nextUrl = formData.get('next') as string || '/ai-redesign'

  if (error) {
    redirect(`/login?error=true&mode=signup&next=${encodeURIComponent(nextUrl)}&message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  // Depending on Supabase settings, email confirmation may be required. 
  // Assuming it is disabled for this prototype flow, they are auto-logged in.
  redirect(nextUrl)
}

export async function logout() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/')
}
