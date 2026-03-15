'use server';

import { createAdminClient, createServerSupabaseClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const ADMIN_EMAILS = ['dreammakersstudio24@gmail.com'];

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    throw new Error('Unauthorized');
  }
}

// --- Category Actions ---

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('product_categories')
    .insert({ name, slug });

  if (error) throw error;
  revalidatePath('/app/admin/shop');
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('product_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  revalidatePath('/app/admin/shop');
}

// --- Product Actions ---

export async function upsertProduct(formData: FormData) {
  await requireAdmin();
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const affiliate_url = formData.get('affiliate_url') as string;
  const category_id = formData.get('category_id') as string;
  const image_file = formData.get('image') as File;
  let image_url = formData.get('existing_image_url') as string;

  const supabase = createAdminClient();

  // Handle Image Upload if new file provided
  if (image_file && image_file.size > 0) {
    const timestamp = Date.now();
    const fileName = `products/${timestamp}_${image_file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, image_file);
    
    if (uploadError) throw uploadError;
    image_url = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
  }

  const productData = {
    title,
    description,
    affiliate_url,
    category_id: category_id || null,
    image_url
  };

  if (id) {
    const { error } = await supabase.from('products').update(productData).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('products').insert(productData);
    if (error) throw error;
  }

  revalidatePath('/app/admin/shop');
  revalidatePath('/shop');
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/app/admin/shop');
  revalidatePath('/shop');
}
