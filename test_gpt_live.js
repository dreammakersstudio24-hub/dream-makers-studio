const Replicate = require("replicate");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  console.log("Testing openai/gpt-image-1.5 live...");
  try {
    const output = await replicate.run(
      "openai/gpt-image-1.5",
      {
        input: {
          image: "https://v1.dreammakersstudio.xyz/landing-hero.png", // reliable fallback image
          prompt: "Redesign this room into a modern luxury living room.",
          size: "1024x1024",
          quality: "high"
        }
      }
    );
    console.log("SUCCESS! Output:", JSON.stringify(output, null, 2));
  } catch (error) {
    if (error.response) {
       console.error("API ERROR:", await error.response.text());
    } else {
       console.error("ERROR:", error.message);
    }
  }
}

main();
