import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createServerSupabaseClient, createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 60;

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

    // Specific Garden Prompting Logic
    const fullPrompt = `A stunning, high-end professional landscape design and garden transformation in ${stylePrompt} style. 
    Transform the space into a luxury outdoor oasis. ${featuresString} 
    Include lush greenery, architectural lighting, premium stone paving, and high-quality outdoor furniture. 
    STRICTLY PRESERVE the existing building structures and land geometry while completely redesigning the plants and hardscaping.
    Professional architectural photography, 8k resolution, cinematic lighting, masterpiece.`;

    const output = await replicate.run(
        "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        {
          input: {
            image: formattedImage,
            prompt: fullPrompt,
            negative_prompt: "lowres, watermark, logo, text, deformed, blurry, indoor, interior, kitchen, living room, bedroom",
            guidance_scale: 15,
            prompt_strength: 0.85,
          }
        }
    );

    let resultUrl = "";
    if (Array.isArray(output) && output.length > 0) resultUrl = String(output[output.length - 1]);
    else if (typeof output === "string") resultUrl = output;

    if (!resultUrl) throw new Error("Failed to generate image URL.");

    // --- Save & Deduct ---
    const timestamp = Date.now();
    const base64Data = formattedImage.split(',')[1];
    const originalBuffer = Buffer.from(base64Data, 'base64');
    const originalFileName = `${user.id}/${timestamp}_garden_original.jpg`;
    
    await supabase.storage.from('images').upload(originalFileName, originalBuffer, { contentType: 'image/jpeg' });
    const originalUrl = supabase.storage.from('images').getPublicUrl(originalFileName).data.publicUrl;

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
