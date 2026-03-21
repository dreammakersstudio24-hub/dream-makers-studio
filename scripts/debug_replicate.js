
const Replicate = require("replicate");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function test() {
  console.log("Testing Ideogram v3 Turbo...");
  try {
    const output = await replicate.run(
      "ideogram-ai/ideogram-v3-turbo",
      {
        input: {
          prompt: "A beautiful modern living room with large windows and a white sofa, realistic architectural photography, high detail.",
          aspect_ratio: "16:9",
          style_type: "Realistic"
        }
      }
    );
    console.log("SUCCESS! Output:", output);
    if (output && typeof output.url === 'function') {
        console.log("URL method exists! Result:", output.url().toString());
    }
  } catch (error) {
    console.error("FAILED!");
    console.error("Message:", error.message);
    if (error.response) {
        try {
            const body = await error.response.json();
            console.error("Detailed Error Body:", JSON.stringify(body, null, 2));
        } catch (e) {
            console.error("Raw Error Text:", await error.response.text());
        }
    } else {
        console.error("Error Object:", error);
    }
  }
}

test();
