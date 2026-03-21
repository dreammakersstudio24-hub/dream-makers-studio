
const Replicate = require("replicate");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  console.log("Investigating google/imagen-3 schema...");
  try {
    const model = await replicate.models.get("google", "imagen-3");
    const latestVersion = model.latest_version;
    console.log("Latest Version ID:", latestVersion.id);
    
    // We can't easily get the openapi_schema from the standard model object in JS SDK
    // But we can run a test with invalid inputs to trigger a schema error that has the info
    console.log("Running dummy prediction to trigger schema info...");
    try {
        await replicate.run("google/imagen-3", { input: { help_me_debug_schema: true } });
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
