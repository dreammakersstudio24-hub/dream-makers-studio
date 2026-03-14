import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; 

// This endpoint is meant to be called daily via Vercel Cron.
// It deletes database rows from `generations` older than 30 days,
// and removes the corresponding physical files in Supabase storage.

export async function GET(request: Request) {
  // 1. Verify Vercel Cron Secret for security
  const authHeader = request.headers.get('authorization');
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseAdmin = createAdminClient();

    // 2. Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoIso = thirtyDaysAgo.toISOString();

    // 3. Find all generations older than 30 days
    const { data: expiredGenerations, error: fetchError } = await supabaseAdmin
      .from('generations')
      .select('id, generated_image_url')
      .lt('created_at', thirtyDaysAgoIso);

    if (fetchError) {
      console.error('Error fetching expired generations:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!expiredGenerations || expiredGenerations.length === 0) {
      return NextResponse.json({ message: 'No expired images found.' }, { status: 200 });
    }

    console.log(`Found ${expiredGenerations.length} expired images. Starting cleanup...`);

    let deletedCount = 0;
    const failedDeletions = [];

    // 4. Delete the physical images from the storage bucket and then the DB row
    for (const gen of expiredGenerations) {
      try {
        if (gen.generated_image_url) {
            // Extract the filename from the public URL.
            // URL format depends on supabase, typically ends with /storage/v1/object/public/images/FILE_NAME.ext
            const urlParts = gen.generated_image_url.split('/');
            const fileName = urlParts[urlParts.length - 1];

            if (fileName) {
                 const { error: storageError } = await supabaseAdmin
                   .storage
                   .from('images')
                   .remove([fileName]);
                 
                 if (storageError) {
                     console.error(`Failed to delete storage file ${fileName}:`, storageError);
                     // Note: We might still want to delete the DB row even if storage deletion fails (e.g., file already gone), 
                     // but logging it is important.
                 }
            }
        }

        // Delete the DB row
        const { error: dbError } = await supabaseAdmin
          .from('generations')
          .delete()
          .eq('id', gen.id);

        if (dbError) throw dbError;

        deletedCount++;
      } catch (err: any) {
         console.error(`Error deleting generation ${gen.id}:`, err);
         failedDeletions.push(gen.id);
      }
    }

    return NextResponse.json({ 
        message: 'Cleanup successful', 
        deletedCount,
        failedCount: failedDeletions.length
    }, { status: 200 });

  } catch (err: any) {
    console.error('Unexpected error in cleanup cron:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
