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
  try {
    await requireAdmin();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('product_categories')
      .insert({ name, slug });

    if (error) throw error;
    revalidatePath('/app/admin/shop');
  } catch (error: any) {
    console.error('Error creating category:', error);
  }
}

export async function deleteCategory(id: string) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/app/admin/shop');
  } catch (error: any) {
    console.error('Error deleting category:', error);
  }
}

// --- Product Actions ---

export async function upsertProduct(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const affiliate_url = formData.get('affiliate_url') as string;
    const external_image_url = formData.get('external_image_url') as string;
    const category_ids = formData.getAll('category_ids') as string[];
    const image_file = formData.get('image') as File;
    let image_url = external_image_url || formData.get('existing_image_url') as string;

    const supabase = createAdminClient();

    // Handle Image Upload if new file provided AND no external URL
    if (!external_image_url && image_file && image_file.size > 0) {
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
      image_url
    };

    let productId = id;

    if (id) {
      const { error } = await supabase.from('products').update(productData).eq('id', id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from('products').insert(productData).select('id').single();
      if (error) throw error;
      productId = data.id;
    }

    // Update Category Assignments
    if (productId) {
      // Clear existing assignments
      await supabase.from('product_category_assignment').delete().eq('product_id', productId);
      
      // Add new assignments
      if (category_ids.length > 0) {
        const assignments = category_ids.map(catId => ({
          product_id: productId,
          category_id: catId
        }));
        const { error: assignError } = await supabase.from('product_category_assignment').insert(assignments);
        if (assignError) throw assignError;
      }
    }

    revalidatePath('/app/admin/shop');
    revalidatePath('/shop');
  } catch (error: any) {
    console.error('Error upserting product:', error);
  }
}

export async function importProductsFromCSV(formData: FormData) {
  try {
    await requireAdmin();
    const csvFile = formData.get('file') as File;
    if (!csvFile) return;

    const text = await csvFile.text();
    
    // Robust State-machine CSV Parser (Handles multi-line fields and escaped quotes)
    const parseCSV = (csvText: string) => {
      const rows = [];
      let currentRow = [];
      let currentField = '';
      let inQuotes = false;

      for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (inQuotes) {
          if (char === '"' && nextChar === '"') {
            currentField += '"';
            i++; // Skip next quote
          } else if (char === '"') {
            inQuotes = false;
          } else {
            currentField += char;
          }
        } else {
          if (char === '"') {
            inQuotes = true;
          } else if (char === ',') {
            currentRow.push(currentField.trim());
            currentField = '';
          } else if (char === '\n' || char === '\r') {
            currentRow.push(currentField.trim());
            if (currentRow.some(val => val !== '')) rows.push(currentRow);
            currentRow = [];
            currentField = '';
            if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
          } else {
            currentField += char;
          }
        }
      }
      if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(val => val !== '')) rows.push(currentRow);
      }
      return rows;
    };

    const parsedRows = parseCSV(text);
    if (parsedRows.length < 2) return; // Need header + data

    const header = parsedRows[0].map((h: string) => h.toLowerCase());
    const supabase = createAdminClient();

    // Fetch all categories to map names to IDs
    const { data: allCategories } = await supabase.from('product_categories').select('id, name');
    const categoryMap = new Map(allCategories?.map(c => [c.name.toLowerCase(), c.id]));

    for (let i = 1; i < parsedRows.length; i++) {
      const values = parsedRows[i];
      const row: any = {};
      header.forEach((h, idx) => row[h] = values[idx]);

      if (!row.title || !row.affiliate_url) continue;

      const productData = {
        title: row.title,
        description: row.description || '',
        image_url: row.image || row.image_url,
        affiliate_url: row.url || row.affiliate_url
      };

      const { data: newProd, error: prodErr } = await supabase.from('products').insert(productData).select('id').single();
      
      if (!prodErr && newProd && row.category) {
        const categoryNames = row.category.split('|').map((c: string) => c.trim());
        const categoryIds: string[] = [];

        for (const name of categoryNames) {
          const lowerName = name.toLowerCase();
          let catId = categoryMap.get(lowerName);

          // Auto-create category if it doesn't exist
          if (!catId) {
            const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            const { data: newCat, error: catErr } = await supabase
              .from('product_categories')
              .insert({ name, slug })
              .select('id')
              .single();
            
            if (!catErr && newCat) {
              catId = newCat.id;
              categoryMap.set(lowerName, catId);
            }
          }

          if (catId) categoryIds.push(catId);
        }

        if (categoryIds.length > 0) {
          const assignments = categoryIds.map(catId => ({
             product_id: newProd.id,
             category_id: catId
          }));
          await supabase.from('product_category_assignment').insert(assignments);
        }
      }
    }

    revalidatePath('/app/admin/shop');
    revalidatePath('/shop');
  } catch (error: any) {
    console.error('Error importing CSV:', error);
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/app/admin/shop');
    revalidatePath('/shop');
  } catch (error: any) {
    console.error('Error deleting product:', error);
  }
}

export async function clearAllProducts() {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
    revalidatePath('/app/admin/shop');
    revalidatePath('/shop');
  } catch (error: any) {
    console.error('Error clearing products:', error);
  }
}
