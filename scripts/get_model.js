import Replicate from "replicate";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function main() {
  try {
    const model = await replicate.models.get("adirik", "interior-design");
    fs.writeFileSync("model_info.json", JSON.stringify(model, null, 2));
    console.log("Success");
  } catch (e) {
    fs.writeFileSync("model_error.txt", e.message);
  }
}

main();
