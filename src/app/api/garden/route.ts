import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createServerSupabaseClient, createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 300;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { image, stylePrompt, features = [], aspectRatio = "1:1" } = body;

    if (!image || !stylePrompt) {
      return NextResponse.json({ error: "Image and style are required." }, { status: 400 });
    }
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Replicate API token is not configured." }, { status: 500 });
    }

    // --- Verify Credits ---
    const { data: userMeta } = await supabase.from('users_metadata').select('credits').eq('id', user.id).single();
    const currentCredits = userMeta?.credits || 0;
    if (currentCredits <= 0) {
      return NextResponse.json({ error: "Insufficient AI credits." }, { status: 403 });
    }

    // --- Prepare image ---
    const formattedImage = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;

    // --- Build garden prompt ---
    const landscapeBase = getRandomElement([
      "Masterpiece landscape architecture, professional high-end garden redesign, luxury outdoor living space.",
      "Stunning architectural garden transformation, elite backyard oasis, professional landscape photography.",
      "Award-winning outdoor retreat, high-end landscape synthesis, cinematic architectural exterior.",
    ]);
    const lightingStyle = getRandomElement([
      "cinematic golden hour lighting, soft warm glows",
      "professional architectural night lighting, subtle LED accents",
      "crisp natural daylight, vibrant colors, clear shadows",
    ]);
    const materialFocus = getRandomElement([
      "premium limestone paving, dark volcanic rock accents",
      "luxury teak wood decking, polished granite features",
      "modern concrete geometry, minimalist glass and steel elements",
    ]);

    const featuresText = features.length > 0 ? `MUST INCLUDE: ${features.join(", ")}.` : "";

    // --- 1. Upload original image to Supabase ---
    const timestamp = Date.now();
    const base64Data = formattedImage.split(',')[1];
    const originalBuffer = Buffer.from(base64Data, 'base64');
    const originalFileName = `${user.id}/${timestamp}_garden_original.jpg`;
    await supabase.storage.from('images').upload(originalFileName, originalBuffer, { contentType: 'image/jpeg' });
    const originalUrl = supabase.storage.from('images').getPublicUrl(originalFileName).data.publicUrl;

    // --- 2. Run AI Model (google/nano-banana-pro) ---
    // aspect_ratio: "match_input_image" — automatically preserves original proportions (9:16, 16:9, etc.)
    // image_input passes the original as a strong structural reference
    const output = await replicate.run(
      "google/nano-banana-pro",
      {
        input: {
          prompt: `STRUCTURE PRESERVATION RULE: The spatial layout, land contour, boundary walls, structures, trees positions, paths, and camera perspective are IDENTICAL to the reference image. Do NOT alter the geography of the space. Do NOT zoom, crop, widen, rotate, or shift the camera. This is a MATERIAL AND STYLE transformation only.

          Transform this outdoor space into an award-winning ${stylePrompt} style garden.
          ${featuresText}
          Focus on ${materialFocus} and ${lightingStyle}.
          ${landscapeBase}
          Lush exotic greenery, professional horticultural synthesis. ENTIRELY OUTDOOR DESIGN.
          Quality: 8K resolution, masterpiece, 100mm architectural lens.`,
          image_input: [originalUrl],
          aspect_ratio: "match_input_image",
          output_format: "jpg",
          resolution: "2K",
          safety_filter_level: "block_only_high",
          allow_fallback_model: false,
        }
      }
    );

    // --- 3. Extract URL from output ---
    let resultUrl = "";
    if (Array.isArray(output) && output.length > 0) {
      resultUrl = String(output[0]);
    } else if (typeof output === 'string') {
      resultUrl = output;
    } else if (output && typeof output === 'object' && (output as any).url) {
      resultUrl = String((output as any).url);
    }
    resultUrl = resultUrl.trim();

    if (!resultUrl || !resultUrl.startsWith('http')) {
      throw new Error(`AI generation failed. Model returned no valid image URL.`);
    }

    // --- 4. Upload generated image to Supabase ---
    const imageResponse = await fetch(resultUrl);
    const imageBlob = await imageResponse.blob();
    const generatedFileName = `${user.id}/${timestamp}_garden_result.jpg`;
    await supabase.storage.from('images').upload(generatedFileName, imageBlob, { contentType: 'image/jpeg' });
    const finalUrl = supabase.storage.from('images').getPublicUrl(generatedFileName).data.publicUrl;

    // --- 5. Deduct credit ---
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from('users_metadata').update({ credits: currentCredits - 1 }).eq('id', user.id);

    // --- 6. Save generation record ---
    await supabase.from('generations').insert({
      user_id: user.id,
      original_image_url: originalUrl,
      generated_image_url: finalUrl,
      room_type: 'Garden',
      style: stylePrompt,
    });

    return NextResponse.json({ success: true, resultUrl: finalUrl });

  } catch (error: any) {
    console.error("[GARDEN API ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to generate garden design." }, { status: 500 });
  }
}
