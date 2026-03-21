
const Replicate = require("replicate");
require("dotenv").config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  const testImage = "https://replicate.delivery/pbxt/JR7YmF8Y3z6UqI1eXzGv6z5y0m4S1Z4Q1Z4Q1Z4Q1Z4Q1Z4Q/room.jpg";
  
  console.log("Testing with aspect_ratio: '2:3'...");
  try {
    const output = await replicate.run(
      "openai/gpt-image-1.5",
      {
        input: {
          input_images: [testImage],
          prompt: "A modern living room",
          aspect_ratio: "2:3",
          quality: "medium"
        }
      }
    );
    console.log("Result 1 (2:3):", output);
  } catch (err) {
    console.error("Failed 1 (2:3):", err.message);
  }

  console.log("Testing with size: '1024x1792'...");
  try {
    const output = await replicate.run(
      "openai/gpt-image-1.5",
      {
        input: {
          input_images: [testImage],
          prompt: "A modern living room",
          size: "1024x1792",
          quality: "medium"
        }
      }
    );
    console.log("Result 2 (1024x1792):", output);
  } catch (err) {
    console.error("Failed 2 (1024x1792):", err.message);
  }
}

main();
