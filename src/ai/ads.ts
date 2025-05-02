import { randomUUID } from "crypto";
import fs from "fs/promises";
import Replicate from "replicate";

const replicate = new Replicate();

export async function generateAdsImage(prompt: string) {
  const input = {
    prompt,
    aspect_ratio: "3:4",
    safety_filter_level: "block_only_high",
  };

  const output = await replicate.run("google/imagen-3", { input });

  console.log(output);

  if (!output) {
    throw new Error("No data returned from Replicate");
  }

  const id = randomUUID();
  await fs.writeFile(`./public/ads/${id}.png`, output as any);
  return `/ads/${id}.png`;
}
