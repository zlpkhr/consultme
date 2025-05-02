"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

type MarketFocus = "country" | "regional" | "global";

export function MarketFocusStep({
  initialValue = "global",
  onNext,
  loading = false,
}: {
  initialValue?: MarketFocus;
  onNext: (data: { marketFocus: MarketFocus }) => void;
  loading: boolean;
}) {
  const [marketFocus, setMarketFocus] = useState<MarketFocus>(
    initialValue as MarketFocus
  );

  const handleNext = () => {
    onNext({ marketFocus });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Market Focus</h2>
      <p className="text-muted-foreground">
        Are you focusing on a specific country, region, or going global with
        your product?
      </p>

      <RadioGroup
        value={marketFocus}
        onValueChange={(value) => setMarketFocus(value as MarketFocus)}
        className="space-y-3"
        disabled={loading}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="country" id="country" />
          <Label htmlFor="country">Country-focused</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="regional" id="regional" />
          <Label htmlFor="regional">Regional (multiple countries)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="global" id="global" />
          <Label htmlFor="global">Global</Label>
        </div>
      </RadioGroup>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={loading}>
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
