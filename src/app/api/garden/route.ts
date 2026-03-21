import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createServerSupabaseClient, createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 300; // Increase to 300s to avoid 504 timeouts on Flux Dev

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { image, stylePrompt, features = [], aspectRatio = "1:1" } = body;

    if (!image || !stylePrompt) {
      return NextResponse.json(
        { error: "Image and style are required." },
        { status: 400 }
      );
    }

    // --- Verify Credits ---
    const { data: userMeta } = await supabase
      .from('users_metadata')
      .select('credits')
      .eq('id', user.id)
      .single();

    const currentCredits = userMeta?.credits || 0;
    if (currentCredits <= 0) {
      return NextResponse.json({ error: "Insufficient AI credits." }, { status: 403 });
    }

    const formattedImage = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;

    // Construct features prompt
    const featuresString = features.length > 0 
        ? `MUST INCLUDE the following luxury features: ${features.join(", ")}.` 
        : "";

    // --- Elite Garden Prompt Engineering ---
    const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    const landscapeBase = getRandomElement([
        "Masterpiece landscape architecture, professional high-end garden redesign, luxury outdoor living space.",
        "Stunning architectural garden transformation, elite backyard oasis, professional landscape photography.",
        "Award-winning outdoor retreat, high-end landscape synthesis, cinematic architectural exterior."
    ]);

    const lightingStyle = getRandomElement([
        "cinematic golden hour lighting, soft warm glows",
        "professional architectural night lighting, subtle LED accents",
        "crisp natural daylight, vibrant colors, clear shadows"
    ]);

    const materialFocus = getRandomElement([
        "premium limestone paving, dark volcanic rock accents",
        "luxury teak wood decking, polished granite features",
        "modern concrete geometry, minimalist glass and steel elements"
    ]);

    const fullPrompt = `${landscapeBase} Style: ${stylePrompt}. 
    Features to synthesize: ${features.join(", ")}. 
    Focus on ${materialFocus} and ${lightingStyle}. 
    CLEAN SLATE EXTERIOR: Remove all existing objects, furniture, and clutter.
    ENTIRELY OUTDOOR DESIGN. No ceilings, no indoor walls, no domestic furniture.
    Lush exotic greenery, specimens, professional horticultural synthesis.
    8k resolution, masterpiece, 100mm architectural lens.`;

    // --- 1. Save Original Image to Supabase FIRST ---
    const timestamp = Date.now();
    const base64Data = formattedImage.split(',')[1];
    const originalBuffer = Buffer.from(base64Data, 'base64');
    const originalFileName = `${user.id}/${timestamp}_garden_original.jpg`;
    
    await supabase.storage.from('images').upload(originalFileName, originalBuffer, { contentType: 'image/jpeg' });
    const originalUrl = supabase.storage.from('images').getPublicUrl(originalFileName).data.publicUrl;

    // Map frontend aspect ratio to Flux ControlNet dimensions
    let width = 1024;
    let height = 1024;
    if (aspectRatio === "9:16") {
        width = 768;
        height = 1360;
    } else if (aspectRatio === "16:9") {
        width = 1360;
        height = 768;
    }

    console.log(`[GARDEN] Using Flux ControlNet (Depth) with originalUrl: ${originalUrl}, dims: ${width}x${height}`);

    // xlabs-ai/flux-dev-controlnet on Replicate
    const output = await replicate.run(
        "xlabs-ai/flux-dev-controlnet:9a8db105db745f8b11ad3afe5c8bd892428b2a43ade0b67edc4e0ccd52ff2fda",
        {
          input: {
            control_image: originalUrl,
            prompt: `Redesign this outdoor space while strictly preserving the existing architecture, building structure, and land contours. ${fullPrompt}`,
            control_type: "depth",
            width: width,
            height: height,
            guidance_scale: 3.5,
            num_inference_steps: 16, // Speed up from 28 to 16 for better response time
            control_net_weight: 0.8
          }
        }
    );

    console.log(`[GARDEN] Raw Output Type: ${typeof output}, IsArray: ${Array.isArray(output)}, Value:`, JSON.stringify(output));

    let resultUrl = "";
    try {
        if (output && typeof (output as any).url === 'function') {
            resultUrl = (output as any).url().toString();
        } else if (Array.isArray(output) && output.length > 0) {
            const firstItem = output[0];
            if (typeof firstItem === 'string') {
                resultUrl = firstItem;
            } else if (firstItem && (firstItem as any).url) {
                resultUrl = String((firstItem as any).url);
            }
        } else if (typeof output === "string") {
            resultUrl = output;
        } else if (output && typeof output === "object") {
            const obj = output as any;
            resultUrl = obj.images?.[0] || obj.output?.[0] || obj.url || (typeof obj.url === 'function' ? obj.url() : "");
        }

        if (resultUrl) {
           resultUrl = resultUrl.toString().trim();
        }

    } catch (parseError) {
        console.error("Error parsing Replicate output:", parseError, "Raw output:", output);
    }

    if (!resultUrl || !resultUrl.startsWith('http')) {
       console.error("Invalid output format from Replicate. Raw output:", output);
       throw new Error(`Failed to generate a valid image URL. Please check server logs. Raw response: ${JSON.stringify(output)}`);
    }

    // --- 2. Save & Deduct ---
    const imageResponse = await fetch(resultUrl);
    const imageBlob = await imageResponse.blob();
    const generatedFileName = `${user.id}/${timestamp}_garden_result.jpg`;
    
    await supabase.storage.from('images').upload(generatedFileName, imageBlob, { contentType: 'image/jpeg' });
    const finalUrl = supabase.storage.from('images').getPublicUrl(generatedFileName).data.publicUrl;

    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from('users_metadata').update({ credits: currentCredits - 1 }).eq('id', user.id);

    await supabase.from('generations').insert({
        user_id: user.id,
        original_image_url: originalUrl,
        generated_image_url: finalUrl,
        room_type: 'Garden',
        style: stylePrompt
    });

    return NextResponse.json({ success: true, resultUrl: finalUrl });

  } catch (error: any) {
    console.error("Garden API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
