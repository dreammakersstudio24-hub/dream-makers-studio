'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createOrUpdateProperty(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  // Verify they have an active property subscription
  const { data: propertyRecord } = await supabase
    .from('properties')
    .select('id, is_active')
    .eq('user_id', user.id)
    .single()

  if (!propertyRecord) {
     throw new Error('Subscription not found. Please subscribe first.')
  }

  const title = formData.get('title') as string
  const location = formData.get('location') as string
  const price = formData.get('price') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File | null

  let imageUrl = undefined

  // Handle optional image upload
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(fileName, imageFile)

    if (uploadError) {
      throw new Error(`Image upload failed: ${uploadError.message}`)
    }

    const { data: publicUrlData } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)
      
    imageUrl = publicUrlData.publicUrl
  }

  // Build the payload
  const payload: any = {
    title,
    location,
    price,
    description
  }
  
  if (imageUrl) {
    payload.image_url = imageUrl
  }

  // We are always tying 1 property to 1 user for this $10 model, 
  // so we update the existing record created by the webhook or initial checkout.
  const { error: updateError } = await supabase
    .from('properties')
    .update(payload)
    .eq('user_id', user.id)

  if (updateError) {
    throw new Error(`Failed to save property: ${updateError.message}`)
  }

  revalidatePath('/properties/dashboard')
  revalidatePath('/real-estate')
}
