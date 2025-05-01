import { Button } from "@/components/ui/button";

export function RefinedProjectDescription({
  refinedProductDescription,
  onPrevious,
  onNext,
}: {
  refinedProductDescription: string;
  onPrevious: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-8">
      <div className="text-4xl font-bold text-center max-w-3xl leading-relaxed">
        {refinedProductDescription}
      </div>
      <div className="flex gap-4">
        <Button onClick={onPrevious} variant={"outline"} size={"lg"}>
          Previous
        </Button>
        <Button onClick={onNext} size={"lg"}>
          Next
        </Button>
      </div>
    </div>
  );
}
