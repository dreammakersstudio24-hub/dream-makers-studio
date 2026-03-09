'use server'

import { createServerSupabaseClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addGalleryItem(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: "Unauthorized" }
  }

  const title = formData.get('title') as string
  const styleCategory = formData.get('style_category') as string
  const file = formData.get('image') as File
  
  if (!file || !file.name || !title || !styleCategory) {
    return { error: "Missing required fields" }
  }

  const supabaseAdmin = createAdminClient()

  // 1. Upload to Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  const { error: uploadError } = await supabaseAdmin.storage
    .from('public-gallery')
    .upload(fileName, file)

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` }
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('public-gallery')
    .getPublicUrl(fileName)

  // 3. Insert into Database
  const { error: dbError } = await supabaseAdmin
    .from('gallery_items')
    .insert({
      title,
      style_category: styleCategory,
      after_image_url: publicUrl,
    })

  if (dbError) {
    return { error: `Database insert failed: ${dbError.message}` }
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  
  return { success: true }
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const supabaseAdmin = createAdminClient()
  
  // Try to get the image URL first so we can delete it from storage
  const { data: item } = await supabaseAdmin.from('gallery_items').select('after_image_url').eq('id', id).single()
  
  if (item?.after_image_url) {
     const urlParts = item.after_image_url.split('/')
     const fileName = urlParts.pop()
     if (fileName) {
        await supabaseAdmin.storage.from('public-gallery').remove([fileName])
     }
  }

  const { error } = await supabaseAdmin.from('gallery_items').delete().eq('id', id)
  
  if (error) {
    console.error(`Delete failed: ${error.message}`)
    throw new Error(error.message)
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
}
