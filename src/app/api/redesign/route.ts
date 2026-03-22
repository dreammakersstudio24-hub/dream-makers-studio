import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createServerSupabaseClient, createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 300;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- Room-specific furniture prompts ---
const ROOM_PROMPTS: Record<string, string[]> = {
  living_room: [
    "EXTREMELY MASSIVE luxury L-shaped sectional sofa, gigantic designer coffee table, huge decorative rug, grand media console, towering indoor plants. ABSOLUTELY NO empty spaces.",
    "Two facing oversized velvet sofas, heavy marble accent tables, grand fireplace, massive expensive artwork, stunning crystal chandelier. ABSOLUTELY NO empty spaces.",
    "Gigantic curved high-end sofa, floor-to-ceiling built-in bookshelves, dramatic oversized indoor tree, huge plush rug, stylish expensive coffee table. ABSOLUTELY NO empty spaces.",
  ],
  bedroom: [
    "Gigantic king-size bed with plush premium bedding, elegant nightstands, beautiful headboard, cozy area rug, wardrobe.",
    "Luxurious canopy bed, seating area with two premium armchairs, large mirror, soft ambient lighting, elegant bedding.",
    "Platform bed with massive floor-to-ceiling headboard, floating nightstands, extremely cozy layered blankets, expensive rug.",
  ],
  bathroom: [
    "Stunning freestanding luxury bathtub, elegant double vanity with large mirrors, premium walk-in glass shower, high-end tiling. Functional and usable layout.",
    "Massive walk-in wet room shower with rainfall head, floating wood vanity, ergonomic spacing, realistic plumbing layout, towel warmer.",
    "Beautiful built-in soaking tub, large vanity with luxury marble top, highly functional layout, elegant wall sconces.",
  ],
  kitchen: [
    "Massive luxury kitchen island with barstools, sleek modern built-in cabinets, high-end stainless steel stove and oven, large refrigerator, beautiful countertops. MUST INCLUDE cooking appliances.",
    "U-shaped kitchen layout, premium gas range stove, range hood, deep farmhouse sink, walls covered in high-end cabinets, elegant backsplash. MUST INCLUDE cooking appliances.",
    "Chef's dream kitchen, double ovens, massive wall of cabinetry, built-in fridge, beautiful countertops with cooking prep area. MUST INCLUDE cooking appliances.",
  ],
  home_office: [
    "Large impressive executive desk in center, ergonomic premium office chair, beautiful bookshelves, stylish reading nook, elegant desk lamp.",
    "L-shaped modern workspace, dual monitors setup, sleek floating shelves, comfortable leather reading chair, large window view.",
    "Creative studio layout, massive drafting table, wall full of inspirational art, stylish storage cabinets, premium task lighting.",
  ],
  kids_room: [
    "Fun and colorful custom bunk beds, built-in toy storage shelves, whimsical wall art, cozy reading corner with bean bags, large play rug. MUST BE kid-friendly and safe.",
    "Adorable premium twin bed, beautiful dollhouse or indoor slide, creative play area, floating bookshelves, soft pastel ambient lighting. MUST BE kid-friendly and safe.",
  ],
  balcony: [
    "Luxurious outdoor patio seating, premium weather-resistant sofa set, stunning vertical garden, beautiful evening string lights, modern coffee table. MUST BE outdoor space.",
    "Cozy terrace design, beautiful outdoor dining table for two, lots of lush potted plants, hanging swing chair, outdoor rug and lanterns. MUST BE outdoor space.",
  ],
};

// --- Style-specific visual prompts ---
const STYLE_PROMPTS: Record<string, string> = {
  minimalist: "clean geometric lines, uncluttered surfaces, neutral color palette (white, beige, soft gray), minimal but impactful decor, sleek hidden storage",
  scandinavian: "light warm woods, cozy textiles, white walls, soft natural light, functional layout, hygge atmosphere, simple aesthetic",
  industrial: "exposed brick walls, raw concrete floors, matte black metal accents, vintage leather Chesterfield sofas, heavy iron and reclaimed wood coffee tables, large factory-style windows, exposed piping overhead",
  luxury: "glamorous marble surfaces, gold or brass accents, opulent velvet upholstery, expensive cascading crystal chandeliers, rich deep jewel-tone colors, highly reflective glossy surfaces, massive custom millwork",
  modern: "sleek and sophisticated, bold contrasting colors, massive abstract art pieces, glass and polished steel elements, dramatic spotlighting, sharp architectural angles, highly curated designer furniture",
};

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { image, stylePrompt, roomType, aspectRatio = "1:1" } = body;

    if (!image || !stylePrompt || !roomType) {
      return NextResponse.json({ error: "Image, style, and room type are required." }, { status: 400 });
    }
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Replicate API token is not configured." }, { status: 500 });
    }

    // --- Verify Credits ---
    const { data: userMeta } = await supabase.from('users_metadata').select('credits').eq('id', user.id).single();
    const currentCredits = userMeta?.credits || 0;
    if (currentCredits <= 0) {
      return NextResponse.json({ error: "Insufficient AI credits. Please purchase more." }, { status: 403 });
    }

    // --- Prepare image ---
    const formattedImage = image.startsWith('data:image') ? image : `data:image/jpeg;base64,${image}`;

    // --- Build prompt ---
    const roomObjects = getRandomElement(ROOM_PROMPTS[roomType.toLowerCase()] || ["beautiful high-end centerpiece furniture, luxurious seating, stunning decor."]);
    const styleFeatures = STYLE_PROMPTS[stylePrompt.toLowerCase()] || "beautiful aesthetic, highly coordinated colors, stunning designer look, premium materials";
    const isMinimalist = stylePrompt.toLowerCase().includes("minimalist") || stylePrompt.toLowerCase().includes("scandinavian");
    const densityPrompt = isMinimalist
      ? "SPACIOUS layout, breathing room between furniture, perfectly balanced negative space, clean, curated."
      : "MAXIMALIST styling, DENSE furniture layout, absolutely NO empty floor spaces, extravagant styling.";

    // --- 1. Upload original image to Supabase ---
    const timestamp = Date.now();
    const base64Data = formattedImage.split(',')[1];
    const originalBuffer = Buffer.from(base64Data, 'base64');
    const originalFileName = `${user.id}/${timestamp}_original.jpg`;
    await supabase.storage.from('images').upload(originalFileName, originalBuffer, { contentType: 'image/jpeg' });
    const originalUrl = supabase.storage.from('images').getPublicUrl(originalFileName).data.publicUrl;

    // --- 2. Map aspect ratio (Ideogram v3 supports 9:16 and 16:9 natively) ---
    const mappedAspectRatio = aspectRatio === "9:16" ? "9:16" : aspectRatio === "16:9" ? "16:9" : "1:1";

    // --- 3. Run AI Model (ideogram-v3-quality) ---
    const output = await replicate.run(
      "ideogram-ai/ideogram-v3-quality",
      {
        input: {
          prompt: `Award-winning ${stylePrompt} style interior design for a ${roomType}. ${styleFeatures}. ${roomObjects}. ${densityPrompt} Professional architectural photography, 8k resolution, masterpiece, cinematic lighting. Preserve the exact room layout, walls, windows, doors and camera angle from the reference image.`,
          style_reference_images: [originalUrl],
          aspect_ratio: mappedAspectRatio,
          style_type: "Auto",
          magic_prompt_option: "Off",
          negative_prompt: "lowres, watermark, text, blurry, deformed, cartoon, extra walls, different room layout, different camera angle",
        }
      }
    );

    // --- 4. Extract URL from output ---
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

    // --- 5. Upload generated image to Supabase ---
    const imageResponse = await fetch(resultUrl);
    const imageBlob = await imageResponse.blob();
    const generatedFileName = `${user.id}/${timestamp}_generated.jpg`;
    await supabase.storage.from('images').upload(generatedFileName, imageBlob, { contentType: 'image/jpeg' });
    const finalUrl = supabase.storage.from('images').getPublicUrl(generatedFileName).data.publicUrl;

    // --- 6. Deduct credit ---
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from('users_metadata').update({ credits: currentCredits - 1 }).eq('id', user.id);

    // --- 7. Save generation record ---
    await supabase.from('generations').insert({
      user_id: user.id,
      original_image_url: originalUrl,
      generated_image_url: finalUrl,
      room_type: roomType,
      style: stylePrompt,
    });

    return NextResponse.json({ success: true, resultUrl: finalUrl });

  } catch (error: any) {
    console.error("[REDESIGN API ERROR]", error);
    return NextResponse.json({ error: error.message || "Failed to generate design." }, { status: 500 });
  }
}
