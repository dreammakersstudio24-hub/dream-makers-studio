import Replicate from "replicate";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  try {
    const model = await replicate.models.get("bytedance", "seedream-4.5");
    const version = await replicate.models.versions.get("bytedance", "seedream-4.5", model.latest_version.id);
    
    fs.writeFileSync("seedream_schema.json", JSON.stringify(version.openapi_schema, null, 2));
    console.log("Schema saved to seedream_schema.json");
  } catch (err) {
    console.error(err);
  }
}

main();
