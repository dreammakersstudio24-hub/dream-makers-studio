import { NextResponse } from "next/server";
import Replicate from "replicate";

export const maxDuration = 60; // Set maximum duration to 60s for Vercel

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image, stylePrompt, roomType = "room", aspectRatio = "1:1" } = await req.json();

    if (!image || !stylePrompt) {
      return NextResponse.json(
        { error: "Image and style prompt are required." },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "Replicate API token is not configured." },
        { status: 500 }
      );
    }

    // Clean base64 string if it contains the data uri prefix.
    const formattedImage = image.startsWith('data:image') 
      ? image 
      : `data:image/jpeg;base64,${image}`;

    // Using the cutting-edge Bytedance Seedream 4.5 model for high-fidelity image-to-image generation
    const output = await replicate.run(
        "bytedance/seedream-4.5",
        {
          input: {
            image: formattedImage,
            prompt: `Strictly preserve the exact ${roomType} layout, walls, doors, windows, and structural geometry of the input image. Redesign the interior decor, furniture, and materials in a beautiful photorealistic ${stylePrompt} style. Highly detailed, 8k resolution, professional architectural photography, modern lighting. Do not change the shape or size of the room.`,
            prompt_upsampling: false, // Turn off upsampling to ensure our strict prompt isn't rewritten by the AI
            image_guidance_scale: 1.6, // Higher guidance to stick to original structure (common in SDXL models)
            prompt_strength: 0.65, // 65% redesign, 35% original structure preservation
            aspect_ratio: aspectRatio
          }
        }
    );

    console.log("Raw Replicate Output:", JSON.stringify(output, null, 2));

    // Handle different output formats from Replicate models.
    // Some return a single URL string, some return an array of strings, some return an array of File objects with .url() method
    let resultUrl = "";
    
    if (Array.isArray(output)) {
       const lastElement = output[output.length - 1];
       if (typeof lastElement === "string") {
           resultUrl = lastElement;
       } else if (lastElement && typeof (lastElement as any).url === "function") {
           resultUrl = (lastElement as any).url(); // New Replicate SDK File output format
       } else if (lastElement && typeof lastElement === "object" && (lastElement as any).url) {
           resultUrl = (lastElement as any).url;
       }
    } else if (typeof output === "string") {
       resultUrl = output;
    } else if (output && typeof (output as any).url === "function") {
       resultUrl = (output as any).url();
    } else if (output && typeof output === "object" && (output as any).url) {
       resultUrl = (output as any).url;
    }

    if (!resultUrl) {
       throw new Error("Failed to generate image URL from Replicate");
    }

    return NextResponse.json({ success: true, resultUrl });

  } catch (error: any) {
    console.error("Replicate API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate design." },
      { status: 500 }
    );
  }
}
