import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createAdminClient } from '@/utils/supabase/server';
import { STYLES } from '@/constants/styles';
import { ROOM_TYPES } from '@/constants/roomTypes';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds max duration

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

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

    // Randomly pick 1 to 3 images to generate
    const numImagesToGenerate = Math.floor(Math.random() * 3) + 1;
    console.log(`Auto-generating ${numImagesToGenerate} images for gallery...`);

    const results = [];

    // Process sequentially to avoid Replicate heavy load limits
    for (let i = 0; i < numImagesToGenerate; i++) {
        const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
        const randomRoom = ROOM_TYPES[Math.floor(Math.random() * ROOM_TYPES.length)];
        
        // We use black-forest-labs/flux-schnell because it is incredibly fast and stunning at pure text-to-image.
        const prompt = `A stunning, photorealistic photograph of a ${randomStyle.nameKey} style ${randomRoom.nameKey}. Beautiful, highly curated expensive furniture. Completely furnished. Professional interior design portfolio.`;

        console.log(`Generating: ${prompt}`);

        const output = await replicate.run(
            "black-forest-labs/flux-schnell",
            {
                input: {
                    prompt: prompt,
                    aspect_ratio: "4:5", // 4:5 vertical aesthetic for Pinterest style gallery
                    output_format: "jpg",
                    output_quality: 90
                }
            }
        );

        let resultUrl = "";
        if (Array.isArray(output) && output.length > 0) {
            resultUrl = typeof output[0] === 'string' ? output[0] : (output[0] as any)?.url?.() || String(output[0]);
        } else if (typeof output === "string") {
            resultUrl = output;
        }

        if (!resultUrl || !resultUrl.startsWith('http')) {
            console.error(`Skipping generation ${i+1}: Invalid output from Replicate`, output);
            continue; // Skip onto the next loop if this one failed
        }

        // Upload to Supabase Storage
        const timestamp = Date.now();
        const generatedFileName = `auto_gallery/${timestamp}_auto_${randomStyle.id}_${randomRoom.id}.jpg`;
        
        const imageResponse = await fetch(resultUrl);
        const imageBlob = await imageResponse.blob();
        
        // Make sure the image is smaller than max allowed size, or just upload directly
        const { error: storageError } = await supabaseAdmin.storage
           .from('images')
           .upload(generatedFileName, imageBlob, { contentType: 'image/jpeg' });
        
        if (storageError) {
             console.error(`Skipping generation ${i+1}: Upload failed`, storageError);
             continue;
        }

        const finalUrl = supabaseAdmin.storage.from('images').getPublicUrl(generatedFileName).data.publicUrl;

        // Extract keywords from the names
        const keywords = [randomStyle.nameKey, randomRoom.nameKey, "AI Generated"];

        // Insert into gallery_items as PENDING (is_approved = false)
        const { data: insertedItem, error: insertError } = await supabaseAdmin
            .from('gallery_items')
            .insert({
                title: `${randomStyle.nameKey} ${randomRoom.nameKey}`,
                description: `A beautiful ${randomStyle.nameKey.toLowerCase()} style ${randomRoom.nameKey.toLowerCase()} generated to inspire your next transformation.`,
                style_category: randomStyle.nameKey,
                after_image_url: finalUrl,
                is_approved: false,
                is_ai_generated: true,
                keywords: keywords
            })
            .select()
            .single();

        if (insertError) {
             console.error(`Skipping generation ${i+1}: DB Insert failed`, insertError);
             continue;
        }

        results.push(insertedItem);
    }

    return NextResponse.json({ 
        message: `Successfully generated ${results.length} images pending approval.`, 
        items: results 
    }, { status: 200 });

  } catch (err: any) {
    console.error('Unexpected error in auto-generate cron:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
