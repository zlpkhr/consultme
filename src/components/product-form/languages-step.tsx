"use client";

import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

const LANGUAGES: ComboboxOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
  { value: "ar", label: "Arabic" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

export function LanguagesStep({
  initialValues = ["en"],
  onNext,
  loading = false,
}: {
  initialValues?: string[];
  onNext: (data: { languages: string[] }) => void;
  loading: boolean;
}) {
  const [languages, setLanguages] = useState<string[]>(initialValues);

  const handleNext = () => {
    onNext({ languages });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Languages</h2>
      <p className="text-muted-foreground">
        What languages will your product or service initially support?
      </p>

      <Combobox
        options={LANGUAGES}
        selected={languages}
        onChange={setLanguages}
        placeholder="Select languages"
        searchPlaceholder="Search languages..."
        emptyText="No language found."
        disabled={loading}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={loading || languages.length === 0}
        >
          {loading ? "Processing..." : "Next"}
        </Button>
      </div>
    </div>
  );
}
