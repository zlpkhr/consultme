import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import Replicate from "replicate";
import { z } from "zod";
export const refindeProductDescription = async (description: string) => {
  const refinedDescription = await generateText({
    model: openai("gpt-4o"),
    prompt: `Refine the following product description: ${description}`,
    system: `You are a senior McKinsey consultant specializing in product positioning and market strategy. Your expertise lies in distilling complex product descriptions into compelling, market-ready value propositions. Your task is to analyze the given product description and refine it into a single, powerful slogan that clearly communicates the product's core value proposition and market position. Focus on creating a memorable, impactful statement that resonates with target customers and differentiates the product in the market.`,
  });

  return refinedDescription.text;
};

export const generateTargetAudience = async (description: string) => {
  const targetAudience = await generateObject({
    model: openai("gpt-4o"),
    prompt: `Generate a target audience for the following product description: ${description}`,
    schema: z.object({
      targetAudience: z.array(
        z.object({
          name: z.string(),
          age: z.number(),
          ethnicity: z.string(),
          country: z.string(),
          gender: z.string(),
          location: z.string(),
          interests: z.array(z.string()),
          needs: z.array(z.string()),
        })
      ),
    }),
  });

  return targetAudience.object.targetAudience;
};

/**
 *  outputs = await replicate.async_run(
            "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
            input={
                "seed": random.randint(100, 1000),
                "width": 1024,
                "height": 1024,
                "prompt": prompt,
                "scheduler": "K_EULER",
                "num_outputs": 4,
                "guidance_scale": 0,
                "negative_prompt": "two people, three people, four people, multiple faces, multiple bodies, blurry, extra limbs, bad anatomy, asymmetrical features, watermark, signature, text overlay, poor lighting, overexposed, underexposed, grainy, noise, pixelated, cartoon style, anime style, illustration style, painting style, artificial looking skin, bad hands, extra fingers, missing fingers, double chin, cropped head, low quality, low resolution, amateur photography, selfie style, busy background, distracting elements, oversaturated colors, unnatural skin tones, lens flare, motion blur, soft focus, poorly rendered ears, poorly rendered eyes, poorly rendered teeth, half-body, torso only, no head",
                "num_inference_steps": 4,
            },
        )
 */

const prompt = (person: {
  name: string;
  age: number;
  ethnicity: string;
  country: string;
  gender: string;
}) =>
  `A professional close-up headshot portrait of one ${person.age} ${person.ethnicity} ${person.gender}, captured from chest up against a neutral background. High-quality studio lighting with soft shadows, sharp focus on the face, professional business attire, looking directly at camera with a confident yet approachable expression. 8K resolution, photorealistic style, professional photography, natural skin texture and details. Only one person in the image.`;

export const generateAvatar = async (person: {
  name: string;
  age: number;
  ethnicity: string;
  country: string;
  gender: string;
}) => {
  const replicate = new Replicate();

  const [output] = (await replicate.run(
    "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
    {
      input: {
        seed: Math.floor(Math.random() * 1000),
        width: 1024,
        height: 1024,
        prompt: prompt(person),
        scheduler: "K_EULER",
        num_outputs: 4,
        guidance_scale: 0,
        negative_prompt:
          "two people, three people, four people, multiple faces, multiple bodies, blurry, extra limbs, bad anatomy, asymmetrical features, watermark, signature, text overlay, poor lighting, overexposed, underexposed, grainy, noise, pixelated, cartoon style, anime style, illustration style, painting style, artificial looking skin, bad hands, extra fingers, missing fingers, double chin, cropped head, low quality, low resolution, amateur photography, selfie style, busy background, distracting elements, oversaturated colors, unnatural skin tones, lens flare, motion blur, soft focus, poorly rendered ears, poorly rendered eyes, poorly rendered teeth, half-body, torso only, no head",
        num_inference_steps: 4,
      },
    }
  )) as any;
  const id = randomUUID();
  await writeFile(`./public/avatars/${id}.png`, output);

  return `/avatars/${id}.png`;
};
