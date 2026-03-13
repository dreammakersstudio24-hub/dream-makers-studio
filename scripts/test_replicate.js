import Replicate from "replicate";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  try {
    console.log("Testing Replicate API with rocketdigitalai/interior-design-sdxl...");
    console.log("Token exists:", !!process.env.REPLICATE_API_TOKEN);
    // Use a tiny 1x1 black pixel base64 for testing the API connection
    const dummyImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAAQAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AD//Z";
    
    // Test the lightning model which is faster and guaranteed to be the right hash from our search
    const output = await replicate.run(
      "rocketdigitalai/interior-design-sdxl-lightning:5d8da4e526a6e54ee662db1e3d06eb469d45e4eeb41071d2b8feabc6804daae2",
      {
        input: {
          image: dummyImage,
          prompt: "a beautiful modern living room, extremely detailed",
          negative_prompt: "bad quality",
          num_outputs: 1,
          num_inference_steps: 4,
          guidance_scale: 1.5
        }
      }
    );
    console.log("Success! Output:", output);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
