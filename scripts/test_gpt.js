import Replicate from "replicate";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  try {
    console.log("Testing GPT-Image-1.5 with image-to-image...");
    
    // Read a local image and convert to base64
    const imagePath = "public/landing-hero.png";
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;

    const input = {
      image: base64Image,
      prompt: "Redesign this space into a luxury Japanese Zen garden with a koi pond, stepping stones, and minimalist wooden structures. Cinematic lighting, ultra-realistic.",
      quality: "medium",
      size: "1024x1024"
    };

    console.log("Running prediction on replicate...");
    const output = await replicate.run(
      "openai/gpt-image-1.5",
      { input }
    );
    
    console.log("Output:", JSON.stringify(output, null, 2));
    fs.writeFileSync("gpt_test_result.json", JSON.stringify(output, null, 2));
    console.log("Success! Result saved to gpt_test_result.json");
    
  } catch (error) {
    console.error("Error:", error);
    fs.writeFileSync("gpt_test_error.json", JSON.stringify({ error: error.message }, null, 2));
  }
}

main();
