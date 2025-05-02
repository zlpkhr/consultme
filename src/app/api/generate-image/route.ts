import { NextResponse } from "next/server";
import { generateAdsImage } from "@/ai/ads";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const imagePath = await generateAdsImage(prompt);
    return NextResponse.json({ url: imagePath });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
