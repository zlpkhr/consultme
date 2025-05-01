"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "@/db/schema";
import { generatePDF } from "@/lib/pdf";
import { useEffect, useState } from "react";
import { generateReportAction } from "../actions";

interface ReportData {
  executiveSummary: string;
  targetAudienceInsights: {
    persona: string;
    keyInsights: string[];
    recommendedApproaches: string[];
  }[];
  marketingStrategies: {
    channel: string;
    strategy: string;
    expectedOutcome: string;
  }[];
  conclusion: string;
}

export default function Report({
  project,
  generatingReport,
  setGeneratingReport,
}: {
  project: Project;
  generatingReport?: boolean;
  setGeneratingReport?: (loading: boolean) => void;
}) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project.report) {
      try {
        const parsedReport = JSON.parse(project.report);
        setReport(parsedReport);
        setError(null);
      } catch (e) {
        console.error("Failed to parse report data:", e);
        setError(
          "Failed to parse report data. Please try regenerating the report."
        );
      }
    }
  }, [project.report]);

  const handleRegenerateReport = async () => {
    try {
      setLoading(true);
      if (setGeneratingReport) {
        setGeneratingReport(true);
      }
      setError(null);
      await generateReportAction(project.id);
      // Don't need to setReport here as it will happen via the useEffect when project.report changes
    } catch (e) {
      console.error("Failed to generate report:", e);
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
      if (setGeneratingReport) {
        setGeneratingReport(false);
      }
    }
  };

  const handleDownloadReport = async () => {
    if (!report) return;

    setLoading(true);
    try {
      await generatePDF(project, report);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error || !project.report) {
    return (
      <Card className="mx-auto">
        <CardContent className="p-6 flex flex-col gap-4">
          <div>
            {error || "Report data is missing. Please regenerate the report."}
          </div>
          <Button onClick={handleRegenerateReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return <div className="p-6">Loading report data...</div>;
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-left">
          Marketing Report
        </CardTitle>
      </CardHeader>
      <CardContent id="report-content" className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-slate-700">
            Executive Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {report?.executiveSummary || "No executive summary available"}
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">
            Target Audience Insights
          </h2>
          {report?.targetAudienceInsights?.map((insight, index) => (
            <Card key={index} className="mb-6 bg-gray-50">
              <CardContent className="p-4">
                <h3 className="text-xl font-medium mb-2 text-slate-600">
                  {insight.persona}
                </h3>

                <div className="mb-3">
                  <h4 className="font-medium text-gray-800 mb-1">
                    Key Insights:
                  </h4>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {insight.keyInsights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-1">
                    Recommended Approaches:
                  </h4>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {insight.recommendedApproaches.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">
            Marketing Strategies
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Expected Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.marketingStrategies?.map((strategy, index) => (
                  <TableRow key={index}>
                    <TableCell>{strategy.channel}</TableCell>
                    <TableCell>{strategy.strategy}</TableCell>
                    <TableCell>{strategy.expectedOutcome}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-slate-700">
            Conclusion
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {report?.conclusion || "No conclusion available"}
          </p>
        </section>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Button onClick={handleDownloadReport} disabled={!report || loading}>
          {loading ? "Generating PDF..." : "Download PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
}
