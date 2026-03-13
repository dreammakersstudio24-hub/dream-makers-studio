import { NextResponse } from "next/server";
import Replicate from "replicate";

export const maxDuration = 60; // Set maximum duration to 60s for Vercel

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image, stylePrompt } = await req.json();

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
    // Replicate accepts base64 data URIs starting with 'data:image/...;base64,'
    const formattedImage = image.startsWith('data:image') 
      ? image 
      : `data:image/jpeg;base64,${image}`;

    // rocketdigitalai/interior-design-sdxl model preserves room structure using SDXL ControlNet, yielding photorealistic renders.
    const output = await replicate.run(
        "rocketdigitalai/interior-design-sdxl",
        {
          input: {
            image: formattedImage,
            prompt: `a photorealistic, beautiful interior design of a room in ${stylePrompt} style, highly detailed, 8k resolution, professional architectural photography, modern lighting`,
            negative_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
            num_outputs: 1,
            num_inference_steps: 30, // Default SDXL inference steps
            guidance_scale: 7.5
          }
        }
    );

    // The output is typically an array of image URLs or a single string URL depending on the model.
    // For adirik/interior-design, it returns an array where the second element [1] is usually the generated image (first is a control map or similar sometimes, or it just returns 1 image).
    // Let's handle both string and array returns to be safe.
    
    let resultUrl = "";
    if (Array.isArray(output)) {
       resultUrl = output[output.length - 1]; // usually the final image is last
    } else if (typeof output === "string") {
       resultUrl = output;
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
