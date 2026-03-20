import { NextResponse } from "next/server";
import Replicate from "replicate";
import { createServerSupabaseClient, createAdminClient } from "@/utils/supabase/server";

export const maxDuration = 60; // Set maximum duration to 60s for Vercel

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
    const { image, stylePrompt, roomType, aspectRatio = "1:1" } = body;

    if (!image || !stylePrompt || !roomType) {
      return NextResponse.json(
        { error: "Image, style, and room type are required." },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token is not configured." },
        { status: 500 }
      );
    }

    // --- Verify Credits ---
    const { data: userMeta, error: metaError } = await supabase
      .from('users_metadata')
      .select('credits')
      .eq('id', user.id)
      .single();

    const currentCredits = userMeta?.credits || 0;
    if (currentCredits <= 0) {
      return NextResponse.json(
        { error: "Insufficient AI credits. Please purchase more." },
        { status: 403 }
      );
    }

    // Clean base64 string if it contains the data uri prefix.
    // Replicate accepts base64 data URIs starting with 'data:image/...;base64,'
    const formattedImage = image.startsWith('data:image') 
      ? image 
      : `data:image/jpeg;base64,${image}`;

    // Create dynamic positive prompts based on Room Type to guarantee WOW centerpiece furniture
    // We use an array of variations and randomize them so the user gets a unique image every time!
    let roomSpecificObjects = "";
    const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    
    switch (roomType.toLowerCase()) {
        case "living_room":
            roomSpecificObjects = getRandomElement([
                "EXTREMELY MASSIVE luxury L-shaped sectional sofa that fills the entire room, gigantic designer coffee table taking up the floor space, huge expensive decorative rug, grand media console, towering indoor plants",
                "two facing oversized velvet sofas entirely filling the center space, heavy marble accent tables, grand fireplace, massive expensive artwork covering the walls, stunning crystal chandelier",
                "cozy but gigantic curved high-end sofa, floor-to-ceiling built-in bookshelves packed with decor, dramatic oversized indoor tree, huge plush rug covering the entire floor, stylish expensive coffee table"
            ]);
            // Add strict constraint to completely eliminate empty floor space
            roomSpecificObjects += " -- MUST BE completely filled with expensive, high-end, oversized seating and furniture. ABSOLUTELY NO empty spaces or bare floors allowed.";
            break;
        case "bedroom":
            roomSpecificObjects = getRandomElement([
                "gigantic king-size bed with plush premium bedding, elegant nightstands, beautiful headboard, cozy area rug, wardrobe",
                "luxurious canopy bed, seating area with two premium armchairs, large mirror, soft ambient lighting, elegant bedding",
                "platform bed with massive floor-to-ceiling headboard, floating nightstands, extremely cozy layered blankets, expensive rug"
            ]);
            break;
        case "bathroom":
            roomSpecificObjects = getRandomElement([
                "stunning freestanding luxury bathtub, elegant double vanity with large mirrors, premium walk-in glass shower, high-end tiling",
                "massive walk-in wet room shower with rainfall head, floating wood vanity, ergonomic spacing, realistic plumbing layout, towel warmer",
                "beautiful built-in soaking tub, large vanity with luxury marble top, highly functional usable layout, elegant wall sconces"
            ]);
            // Add a strict architectural constraint for bathrooms
            roomSpecificObjects += " -- MUST HAVE highly functional, usable layout with logical plumbing and ergonomic spacing. Do not block mirrors.";
            break;
        case "kitchen":
            roomSpecificObjects = getRandomElement([
                "massive luxury kitchen island with barstools, sleek modern built-in cabinets, high-end stainless steel stove and oven, large refrigerator, beautiful countertops",
                "U-shaped kitchen layout, premium gas range stove, range hood, deep farmhouse sink, walls covered in high-end cabinets, elegant backsplash",
                "chef's dream kitchen, double ovens, massive wall of cabinetry, built-in fridge, beautiful countertops with cooking prep area"
            ]);
            // Emphasize cooking appliances so it doesn't look like a dining room
            roomSpecificObjects += " -- MUST INCLUDE cooking appliances like stove, oven, sink, and kitchen cabinets.";
            break;
        case "home_office":
            roomSpecificObjects = getRandomElement([
                "large impressive executive desk in center, ergonomic premium office chair, beautiful bookshelves, stylish reading nook, elegant desk lamp",
                "L-shaped modern workspace, dual monitors setup, sleek floating shelves, comfortable leather reading chair, large window view",
                "creative studio layout, massive drafting table, wall full of inspirational art, stylish storage cabinets, premium task lighting"
            ]);
            break;
        case "kids_room":
            roomSpecificObjects = getRandomElement([
                "fun and colorful custom bunk beds, built-in toy storage shelves, whimsical wall art, cozy reading corner with bean bags, large play rug",
                "adorable premium twin bed, beautiful dollhouse or indoor slide, creative play area, floating bookshelves, soft pastel ambient lighting"
            ]);
            // Strictly maintain safety and kid-friendly layouts
            roomSpecificObjects += " -- MUST BE completely kid-friendly, playful, safe design with ample toy storage.";
            break;
        case "balcony":
            roomSpecificObjects = getRandomElement([
                "luxurious outdoor patio seating, premium weather-resistant sofa set, stunning vertical garden, beautiful evening string lights, modern coffee table",
                "cozy terrace design, beautiful outdoor dining table for two, lots of lush potted plants, hanging swing chair, outdoor rug and lanterns"
            ]);
            roomSpecificObjects += " -- MUST BE an outdoor or semi-outdoor space. Add exterior elements like plants and outdoor furniture.";
            break;
        default:
            roomSpecificObjects = "beautiful high-end centerpiece furniture, luxurious seating, stunning decor, elegant lighting";
    }

    // Create dynamic style prompts to ensure each style looks totally distinct
    let styleSpecificFeatures = "";
    switch (stylePrompt.toLowerCase()) {
        case "minimalist":
            styleSpecificFeatures = "clean geometric lines, uncluttered surfaces, neutral color palette (white, beige, soft gray), minimal but impactful decor, sleek hidden storage";
            break;
        case "scandinavian":
            styleSpecificFeatures = "light warm woods, cozy textiles, white walls, soft natural light, functional layout, hygge atmosphere, simple aesthetic";
            break;
        case "industrial":
            styleSpecificFeatures = "exposed brick walls, raw concrete floors, matte black metal accents, massive vintage leather Chesterfield sofas, heavy iron and reclaimed wood coffee tables, large factory-style windows, exposed piping overhead, rich dark mahogany, heavy industrial lighting fixtures";
            break;
        case "luxury":
            styleSpecificFeatures = "glamorous marble surfaces, gold or brass accents, opulent velvet upholstery, expensive cascading crystal chandeliers, rich deep jewel-tone colors, highly reflective glossy surfaces, opulent and heavy decor, massive custom millwork";
            break;
        case "modern":
            styleSpecificFeatures = "sleek and sophisticated, bold contrasting colors, massive abstract art pieces, glass and polished steel elements, dramatic spotlighting, sharp architectural angles, highly curated designer furniture";
            break;
        default:
            styleSpecificFeatures = "beautiful aesthetic, highly coordinated colors, stunning designer look, premium materials";
    }

    // Dynamic Density Control to fix "poor / empty" look for non-minimalist styles
    let densityPrompt = "";
    if (stylePrompt.toLowerCase().includes("minimalist") || stylePrompt.toLowerCase().includes("scandinavian")) {
        densityPrompt = "SPACIOUS layout, breathing room between furniture, perfectly balanced negative space, clean, curated.";
    } else {
        densityPrompt = "MAXIMALIST styling, DENSE furniture layout, room is completely FULL of heavy expensive furniture, stunningly layered decor, absolutely NO huge empty floor spaces, extravagant styling, highly curated magazine layout.";
    }

    // Dynamic negative prompt to help ControlNet shape the output better
    let dynamicNegativePrompt = "lowres, watermark, banner, logo, text, deformed, blurry, blur, out of focus, surreal, extra, ugly, bad architecture, weird proportions, crooked walls";

    // Switch to a specialized MLSD ControlNet pipeline to absolutely guarantee structure locking
    // adirik/interior-design natively handles edge-detection to map and preserve walls, doors, and windows
    const output = await replicate.run(
        "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
        {
          input: {
            image: formattedImage,
            prompt: `A jaw-dropping, award-winning ${stylePrompt} style ${roomType} interior design. CLEAN SLATE: Remove all existing furniture and clutter. Design from scratch while preserving only the room shell (walls, floor, windows). The room features: ${styleSpecificFeatures}. It is FULLY FURNISHED with a ${roomSpecificObjects}. ${densityPrompt} Add beautiful layered rugs, stunning indoor plants, and cinematic photorealistic lighting. Professional architectural photography, 8k resolution, masterpiece, highly detailed.`,
            negative_prompt: dynamicNegativePrompt + ", old furniture, existing items, beds, tables, chairs, mess, clutter, redundant objects",
            guidance_scale: 15, // Default for this model
            prompt_strength: 0.95, // Increased for more creative freedom to delete old items
          }
        }
    );

    // Replicate returns output in different formats depending on the model and stream options.
    // For adirik/interior-design, it typically returns an array of string URLs or a single string URL.
    let resultUrl = "";

    try {
        if (Array.isArray(output) && output.length > 0) {
            const lastItem = output[output.length - 1];
            if (typeof lastItem === 'string') {
                resultUrl = lastItem;
            } else if (lastItem && typeof lastItem.url === 'function') {
                resultUrl = lastItem.url().toString();
            } else if (lastItem && lastItem.url) {
                resultUrl = String(lastItem.url);
            }
        } else if (typeof output === "string") {
            resultUrl = output;
        } else if (output && typeof (output as any).url === 'function') {
            resultUrl = (output as any).url().toString();
        } else if (output && typeof output === "object" && 'url' in output) {
            resultUrl = String((output as any).url);
        }

        if (resultUrl) {
           resultUrl = resultUrl.toString().trim();
        }

    } catch (parseError) {
        console.error("Error parsing Replicate output:", parseError, "Raw output:", output);
    }

    if (!resultUrl || !resultUrl.startsWith('http')) {
       console.error("Invalid output format from Replicate. Raw output:", output);
       let debugInfo = "";
       try { debugInfo = Array.isArray(output) ? `Array[${output.length}] of ${typeof output[0]}` : typeof output; } catch(e) {}
       throw new Error(`Failed to generate a valid image URL from Replicate. Raw type: ${debugInfo}`);
    }

    // --- Save to Supabase Storage ---
    const timestamp = Date.now();
    
    // 1. Upload original image
    const base64Data = formattedImage.split(',')[1];
    const originalBuffer = Buffer.from(base64Data, 'base64');
    const originalFileName = `${user.id}/${timestamp}_original.jpg`;
    
    await supabase.storage.from('images').upload(originalFileName, originalBuffer, {
        contentType: 'image/jpeg',
    });
    const originalUrl = supabase.storage.from('images').getPublicUrl(originalFileName).data.publicUrl;

    // 2. Fetch and upload generated image
    const imageResponse = await fetch(resultUrl);
    const imageBlob = await imageResponse.blob();
    const generatedFileName = `${user.id}/${timestamp}_generated.jpg`;
    
    await supabase.storage.from('images').upload(generatedFileName, imageBlob, {
        contentType: 'image/jpeg',
    });
    const finalUrl = supabase.storage.from('images').getPublicUrl(generatedFileName).data.publicUrl;

    // 3. Deduct credit (using admin client to bypass RLS policies)
    const supabaseAdmin = createAdminClient();
    const { error: deductError } = await supabaseAdmin
      .from('users_metadata')
      .update({ credits: currentCredits - 1 })
      .eq('id', user.id);

    if (deductError) {
       console.error("Failed to deduct credit:", deductError);
       // We still continue to save the generation even if this fails, but it's logged
    }

    // 4. Save generation record to database
    await supabase.from('generations').insert({
        user_id: user.id,
        original_image_url: originalUrl,
        generated_image_url: finalUrl,
        room_type: roomType,
        style: stylePrompt
    });

    return NextResponse.json({ success: true, resultUrl: finalUrl });

  } catch (error: any) {
    console.error("Replicate API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate design." },
      { status: 500 }
    );
  }
}
