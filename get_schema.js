const Replicate = require("replicate");
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

async function main() {
  try {
    const model = await replicate.models.get("openai", "gpt-image-1.5");
    console.log("VERSION:", model.latest_version.id);
    console.log("SCHEMA:", JSON.stringify(model.latest_version.openapi_schema, null, 2));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
main();
