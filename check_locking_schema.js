const Replicate = require("replicate");
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  const models = [
    "google/imagen-3",
    "xlabs-ai/flux-dev-controlnet"
  ];

  for (const modelId of models) {
    try {
      console.log(`\n--- Schema for ${modelId} ---`);
      const model = await replicate.models.get(modelId.split('/')[0], modelId.split('/')[1]);
      const latestVersion = model.latest_version;
      console.log(`Latest Version: ${latestVersion.id}`);
      console.log(`Inputs:`, JSON.stringify(latestVersion.openapi_schema.components.schemas.Input.properties, null, 2));
    } catch (e) {
      console.error(`Error fetching ${modelId}:`, e.message);
    }
  }
}

main();
