
const Replicate = require("replicate");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  console.log("Investigating xlabs-ai/flux-dev-controlnet schema...");
  try {
    // Attempt to run with invalid inputs to trigger a schema error
    try {
        await replicate.run("xlabs-ai/flux-dev-controlnet", { input: { debug: true } });
    } catch (error) {
        if (error.response) {
            const body = await error.response.json();
            console.log("SCHEMA ERROR response:", JSON.stringify(body, null, 2));
        } else {
            console.log("Error message:", error.message);
        }
    }
  } catch (error) {
    console.error("Main catch error:", error.message);
  }
}

main();
