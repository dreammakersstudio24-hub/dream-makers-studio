'use server';

import { createAdminClient, createServerSupabaseClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// We must check if the user is the admin.
const ADMIN_EMAILS = ['dreammakersstudio24@gmail.com'];

async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || (!ADMIN_EMAILS.includes(user.email ?? '') && user.email !== 'dreammakersstudio24@gmail.com')) {
    throw new Error('Unauthorized Access - Admin Only');
  }
}

export async function approveGalleryItem(id: string, formData: FormData) {
  await requireAdmin();
  
  const affiliateUrl = formData.get('affiliateUrl') as string;
  const keywordsString = formData.get('keywords') as string;
  
  let keywords: string[] | undefined;
  if (keywordsString) {
      keywords = keywordsString.split(',').map(k => k.trim()).filter(k => k.length > 0);
  }

  const supabaseAdmin = createAdminClient();
  
  const updateData: any = { is_approved: true };
  if (affiliateUrl) updateData.affiliate_url = affiliateUrl;
  if (keywords && keywords.length > 0) updateData.keywords = keywords;

  const { error } = await supabaseAdmin
    .from('gallery_items')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error approving item:', error);
    throw new Error('Failed to approve item');
  }

  revalidatePath('/app/admin');
  revalidatePath('/gallery');
}

export async function rejectGalleryItem(id: string, imageUrl?: string) {
  await requireAdmin();
  const supabaseAdmin = createAdminClient();

  // 1. Delete from storage if it exists
  if (imageUrl) {
      try {
          const urlParts = imageUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          if (fileName) {
              await supabaseAdmin.storage.from('images').remove([`auto_gallery/${fileName}`]);
          }
      } catch (e) {
          console.error('Failed to parse or delete storage image during rejection', e);
      }
  }

  // 2. Delete from DB
  const { error } = await supabaseAdmin
    .from('gallery_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error rejecting item:', error);
    throw new Error('Failed to reject item');
  }

  revalidatePath('/app/admin');
}
