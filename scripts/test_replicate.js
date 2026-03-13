import Replicate from "replicate";
import fs from "fs";
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
    console.log("Raw Output:", JSON.stringify(output, null, 2));
    
    // Save to a local file so I can read it without trusting the terminal output buffer
    fs.writeFileSync("replicate_test_output.json", JSON.stringify(output, null, 2));
    console.log("Saved to replicate_test_output.json");
    
    // Force exit to prevent hanging
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    fs.writeFileSync("replicate_test_error.json", JSON.stringify({error: error.message}, null, 2));
    process.exit(1);
  }
}

main();
