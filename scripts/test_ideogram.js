
const Replicate = require("replicate");
require("dotenv").config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  const testImage = "https://replicate.delivery/pbxt/JR7YmF8Y3z6UqI1eXzGv6z5y0m4S1Z4Q1Z4Q1Z4Q1Z4Q1Z4Q/room.jpg";
  
  console.log("Testing Ideogram v3 Turbo...");
  try {
    const output = await replicate.run(
      "ideogram-ai/ideogram-v3-turbo",
      {
        input: {
          image: testImage,
          prompt: "A modern living room",
          aspect_ratio: "9:16",
          image_weight: 90,
          style_type: "REALISTIC"
        }
      }
    );
    console.log("Ideogram Success! Output:", JSON.stringify(output, null, 2));
  } catch (err) {
    console.error("Ideogram Failed:", err.message);
  }
}

main();
