'use server'

import { createServerSupabaseClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addGalleryItem(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const title = formData.get('title') as string
  const styleCategory = formData.get('style_category') as string
  const file = formData.get('image') as File
  
  if (!file || !file.name || !title || !styleCategory) {
    throw new Error("Missing required fields")
  }

  // 1. Upload to Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('public-gallery')
    .upload(fileName, file)

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('public-gallery')
    .getPublicUrl(fileName)

  // 3. Insert into Database
  const { error: dbError } = await supabase
    .from('gallery_items')
    .insert({
      title,
      style_category: styleCategory,
      after_image_url: publicUrl,
    })

  if (dbError) {
    throw new Error(`Database insert failed: ${dbError.message}`)
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  redirect('/admin/gallery')
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createServerSupabaseClient()
  
  // Try to get the image URL first so we can delete it from storage
  const { data: item } = await supabase.from('gallery_items').select('after_image_url').eq('id', id).single()
  
  if (item?.after_image_url) {
     const urlParts = item.after_image_url.split('/')
     const fileName = urlParts.pop()
     if (fileName) {
        await supabase.storage.from('public-gallery').remove([fileName])
     }
  }

  const { error } = await supabase.from('gallery_items').delete().eq('id', id)
  
  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
}
