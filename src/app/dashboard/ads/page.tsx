"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function AdsPage() {
  const searchParams = useSearchParams();
  const [productDescription, setProductDescription] = useState(
    searchParams.get("product") || ""
  );
  const [targetAudience, setTargetAudience] = useState(
    searchParams.get("audience") || ""
  );
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Create a single, high-quality social media advertisement image for a product with the following description: ${productDescription}. Target audience: ${targetAudience}. The image should be modern, eye-catching, and optimized for social media platforms. Focus on creating one compelling visual that clearly showcases the product's key features and benefits.`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setGeneratedImage(data.url);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = "generated-ad.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto py-8 px-8">
      <h1 className="text-3xl font-bold mb-8">Generate Social Media Ad</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Ad Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product Description</Label>
              <Textarea
                id="product"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your product..."
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Textarea
                id="audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target audience..."
                className="min-h-[100px]"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !productDescription || !targetAudience}
            >
              {isLoading ? "Generating..." : "Generate Ad"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated Ad</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedImage ? (
              <div className="space-y-4">
                <img
                  src={generatedImage}
                  alt="Generated advertisement"
                  className="w-full rounded-lg"
                />
                <Button
                  onClick={handleDownload}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  {isLoading
                    ? "Generating your ad..."
                    : "Your generated ad will appear here"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
