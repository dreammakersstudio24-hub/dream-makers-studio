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
    console.log("Testing Replicate API with bytedance/seedream-4.5...");
    // Use a tiny 1x1 black pixel base64 for testing the API connection
    const dummyImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAAQAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AD//Z";
    
    const output = await replicate.run(
      "bytedance/seedream-4.5",
      {
        input: {
          image: dummyImage,
          prompt: "a beautiful modern living room, extremely detailed",
        }
      }
    );
    console.log("Output Type:", typeof output);
    console.log("Is Array?", Array.isArray(output));
    console.log("Raw Output:", JSON.stringify(output, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
