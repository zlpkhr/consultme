import { Project } from "@/db/schema";
import jsPDF from "jspdf";

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

/**
 * Generates a PDF report from project data
 * @param project The project containing report data
 * @param report The parsed report data
 * @returns A Promise that resolves when the PDF is generated and downloaded
 */
export const generatePDF = async (
  project: Project,
  report: ReportData
): Promise<void> => {
  // Create a PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // PDF dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 20; // Starting y position

  // Helper functions for PDF creation
  const addHeading = (text: string, size = 16, spacing = 8) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(size);
    pdf.text(text, margin, y);
    y += spacing + size / 4;
  };

  const addText = (text: string, size = 11, spacing = 5.5) => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(size);

    // Split text to fit within page width
    const textLines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(textLines, margin, y);
    y += textLines.length * spacing + 4;
  };

  const addSeparator = (spacing = 6) => {
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y, pageWidth - margin, y);
    y += spacing;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage();
      y = 20;
    }
  };

  // Start generating PDF content
  // Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text("Marketing Report", margin, y);
  y += 15;

  // Executive Summary
  checkPageBreak(60);
  addHeading("Executive Summary", 18);
  addText(report.executiveSummary);

  // Separator
  addSeparator(10);

  // Target Audience Insights
  checkPageBreak(60);
  addHeading("Target Audience Insights", 18);

  report.targetAudienceInsights.forEach((insight, index) => {
    checkPageBreak(60);

    // Persona
    addHeading(insight.persona, 14, 6);

    // Key insights
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Key Insights:", margin, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    insight.keyInsights.forEach((item) => {
      checkPageBreak(10);
      pdf.text("• " + item, margin + 5, y);
      y += 6;
    });

    y += 4;

    // Recommended approaches
    checkPageBreak(10);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Recommended Approaches:", margin, y);
    y += 6;

    pdf.setFont("helvetica", "normal");
    insight.recommendedApproaches.forEach((item) => {
      checkPageBreak(10);
      pdf.text("• " + item, margin + 5, y);
      y += 6;
    });

    y += 6;
  });

  // Separator
  addSeparator(10);

  // Marketing Strategies - IMPROVED TABLE
  checkPageBreak(90);
  addHeading("Marketing Strategies", 18);

  // Improved table with proper cell background, borders and padding
  const createTable = () => {
    // Table configuration
    const colWidths = [
      contentWidth * 0.25,
      contentWidth * 0.4,
      contentWidth * 0.35,
    ]; // Column widths proportions
    const rowHeight = 8; // Base row height
    const cellPadding = 3; // Padding inside cells

    // Table headers
    pdf.setFillColor(240, 240, 240); // Light gray background for header
    pdf.setDrawColor(100, 100, 100);

    // Draw header background
    pdf.rect(
      margin,
      y,
      colWidths[0] + colWidths[1] + colWidths[2],
      rowHeight + cellPadding * 2,
      "F"
    );

    // Header text
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Channel", margin + cellPadding, y + rowHeight);
    pdf.text("Strategy", margin + colWidths[0] + cellPadding, y + rowHeight);
    pdf.text(
      "Expected Outcome",
      margin + colWidths[0] + colWidths[1] + cellPadding,
      y + rowHeight
    );

    // Move y position past the header
    y += rowHeight + cellPadding * 2;

    // Data rows
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    // For each strategy
    report.marketingStrategies.forEach((strategy, index) => {
      // Split text for each column to calculate row height
      const channelLines = pdf.splitTextToSize(
        strategy.channel,
        colWidths[0] - cellPadding * 2
      );
      const strategyLines = pdf.splitTextToSize(
        strategy.strategy,
        colWidths[1] - cellPadding * 2
      );
      const outcomeLines = pdf.splitTextToSize(
        strategy.expectedOutcome,
        colWidths[2] - cellPadding * 2
      );

      // Calculate max number of lines for this row
      const maxLines = Math.max(
        channelLines.length,
        strategyLines.length,
        outcomeLines.length
      );

      // Calculate row height based on content
      const currentRowHeight = maxLines * rowHeight + cellPadding * 2;

      // Check for page break
      checkPageBreak(currentRowHeight + 5);

      // Alternate row background for better readability
      if (index % 2 === 1) {
        pdf.setFillColor(248, 248, 248);
        pdf.rect(
          margin,
          y,
          colWidths[0] + colWidths[1] + colWidths[2],
          currentRowHeight,
          "F"
        );
      }

      // Add cell content with proper padding
      pdf.text(channelLines, margin + cellPadding, y + rowHeight);
      pdf.text(
        strategyLines,
        margin + colWidths[0] + cellPadding,
        y + rowHeight
      );
      pdf.text(
        outcomeLines,
        margin + colWidths[0] + colWidths[1] + cellPadding,
        y + rowHeight
      );

      // Draw cell borders
      // Horizontal line at bottom of row
      pdf.line(
        margin,
        y + currentRowHeight,
        margin + colWidths[0] + colWidths[1] + colWidths[2],
        y + currentRowHeight
      );

      // Vertical lines between columns
      pdf.line(
        margin + colWidths[0],
        y,
        margin + colWidths[0],
        y + currentRowHeight
      );
      pdf.line(
        margin + colWidths[0] + colWidths[1],
        y,
        margin + colWidths[0] + colWidths[1],
        y + currentRowHeight
      );

      // Move y position for next row
      y += currentRowHeight;
    });

    // Draw outer border for the entire table
    pdf.rect(
      margin,
      y -
        (report.marketingStrategies.length * rowHeight + cellPadding * 2) -
        rowHeight -
        cellPadding * 2,
      colWidths[0] + colWidths[1] + colWidths[2],
      report.marketingStrategies.length * rowHeight +
        cellPadding * 2 +
        rowHeight +
        cellPadding * 2
    );

    // Add some space after the table
    y += 6;
  };

  // Create the marketing strategies table
  createTable();

  // Separator
  addSeparator(10);

  // Conclusion
  checkPageBreak(60);
  addHeading("Conclusion", 18);
  addText(report.conclusion);

  // Save PDF
  pdf.save(`${project.name.replace(/\s+/g, "_")}_marketing_report.pdf`);
};
