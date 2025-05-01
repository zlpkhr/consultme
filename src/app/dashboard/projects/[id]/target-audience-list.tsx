import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TargetAudience } from "@/db/projects";
export function TargetAudienceList({
  generatingTargetAudience,
  targetAudience,
  onNext,
  onPrevious,
  generatingReport,
}: {
  generatingTargetAudience: boolean;
  generatingReport: boolean;
  targetAudience: TargetAudience[];
  onNext: () => void;
  onPrevious: () => void;
}) {
  if (generatingTargetAudience) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-gray-900"></div>
        <h2 className="text-3xl font-bold text-center">
          Generating Target Audience
        </h2>
        <p className="text-gray-500 text-lg">This may take a few moments...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targetAudience.map((audience, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <img
                src={audience.avatar}
                alt={`${audience.name}'s avatar`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <CardTitle>{audience.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Age</Label>
                  <p>{audience.age}</p>
                </div>
                <div>
                  <Label>Gender</Label>
                  <p>{audience.gender}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p>{audience.location}</p>
                </div>
                <div>
                  <Label>Country</Label>
                  <p>{audience.country}</p>
                </div>
                <div>
                  <Label>Ethnicity</Label>
                  <p>{audience.ethnicity}</p>
                </div>
              </div>
              <div>
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {audience.interests.map((interest, i) => (
                    <Badge key={i} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label>Needs</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {audience.needs.map((need, i) => (
                    <Badge key={i} variant="secondary">
                      {need}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center w-full gap-4">
        <Button onClick={onPrevious} variant="outline">
          Previous
        </Button>
        <Button onClick={onNext} disabled={generatingReport}>
          {generatingReport ? (
            <>
              <span className="mr-2">Generating Report</span>
              <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
            </>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </div>
  );
}
