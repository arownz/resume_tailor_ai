import jsPDF from "jspdf";
import type { Resume, TailoredOutput } from "../types/models";

export class PDFService {
  /**
   * Generate a modified resume PDF based on AI suggestions
   */
  static async generateModifiedResume(
    originalResume: Resume,
    modifications: TailoredOutput
  ): Promise<Blob> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    let yPosition = 20;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = pdf.splitTextToSize(text, contentWidth);

      // Check if we need a new page
      if (
        yPosition + lines.length * fontSize * 0.4 >
        pdf.internal.pageSize.getHeight() - 20
      ) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.text(lines, marginLeft, yPosition);
      yPosition += lines.length * fontSize * 0.4 + 2;
    };

    // Header
    pdf.setFillColor(248, 106, 104); // Rose color
    pdf.rect(0, 0, pageWidth, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text(originalResume.name, marginLeft, 20);
    yPosition = 40;

    // Contact Info
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    if (originalResume.contact) {
      pdf.text(originalResume.contact, marginLeft, yPosition);
      yPosition += 6;
    }
    if (originalResume.email) {
      pdf.text(originalResume.email, marginLeft, yPosition);
      yPosition += 10;
    }

    // Professional Summary (if exists)
    if (originalResume.summary) {
      yPosition += 5;
      addText("PROFESSIONAL SUMMARY", 14, true);
      yPosition += 2;
      addText(originalResume.summary, 10);
      yPosition += 5;
    }

    // Skills Section with matched skills highlighted
    yPosition += 5;
    addText("SKILLS", 14, true);
    yPosition += 2;

    // Add matched skills first (these are good for the job)
    if (modifications.matchedSkills.length > 0) {
      pdf.setTextColor(34, 197, 94); // Green color
      addText(`✓ ${modifications.matchedSkills.join(" • ")}`, 10);
      pdf.setTextColor(0, 0, 0);
    }

    // Add remaining skills
    const remainingSkills = originalResume.skills.filter(
      (skill) => !modifications.matchedSkills.includes(skill)
    );
    if (remainingSkills.length > 0) {
      addText(remainingSkills.join(" • "), 10);
    }
    yPosition += 5;

    // Experience Section with enhanced descriptions
    if (originalResume.experience && originalResume.experience.length > 0) {
      yPosition += 5;
      addText("PROFESSIONAL EXPERIENCE", 14, true);
      yPosition += 5;

      originalResume.experience.forEach((exp) => {
        // Company and Title
        addText(`${exp.title}`, 12, true);
        if (exp.company) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "italic");
          pdf.text(`${exp.company}`, marginLeft, yPosition);
          yPosition += 5;
        }
        if (exp.duration) {
          pdf.setFont("helvetica", "normal");
          pdf.text(exp.duration, marginLeft, yPosition);
          yPosition += 5;
        }

        // Description
        if (exp.description) {
          addText(exp.description, 10);
        }
        yPosition += 8;
      });
    }

    // Education Section
    if (originalResume.education && originalResume.education.length > 0) {
      yPosition += 5;
      addText("EDUCATION", 14, true);
      yPosition += 5;

      originalResume.education.forEach((edu) => {
        addText(edu.degree || "Degree", 11, true);
        if (edu.institution) {
          addText(edu.institution, 10);
        }
        if (edu.year) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "italic");
          pdf.text(edu.year, marginLeft, yPosition);
          yPosition += 8;
        }
      });
    }

    // Add recommendations as footer on last page
    yPosition += 10;
    if (
      modifications.recommendations &&
      modifications.recommendations.length > 0
    ) {
      pdf.addPage();
      yPosition = 20;
      addText("AI RECOMMENDATIONS FOR IMPROVEMENT", 14, true);
      yPosition += 5;

      modifications.recommendations.forEach((rec, index) => {
        addText(`${index + 1}. ${rec}`, 9);
        yPosition += 3;
      });
    }

    // Generate blob
    return pdf.output("blob");
  }

  /**
   * Download the generated PDF
   */
  static downloadPDF(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate a comparison PDF showing original vs tailored
   */
  static async generateComparisonPDF(
    _original: Resume,
    modifications: TailoredOutput,
    jobDescription: { title: string; company: string }
  ): Promise<Blob> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const marginLeft = 20;
    let yPosition = 20;

    // Title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Resume Tailoring Analysis", marginLeft, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Job: ${jobDescription.title} at ${jobDescription.company}`,
      marginLeft,
      yPosition
    );
    yPosition += 8;
    pdf.text(`Match Score: ${modifications.score}/100`, marginLeft, yPosition);
    yPosition += 15;

    // Matched Skills
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Matched Skills", marginLeft, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(34, 197, 94); // Green
    modifications.matchedSkills.forEach((skill) => {
      pdf.text(`✓ ${skill}`, marginLeft + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 5;

    // Missing Skills
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Skills to Add", marginLeft, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(239, 68, 68); // Red
    modifications.missingSkills.forEach((skill) => {
      pdf.text(`✗ ${skill}`, marginLeft + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 10;

    // Recommendations
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Recommendations", marginLeft, yPosition);
    yPosition += 7;

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    modifications.recommendations.forEach((rec, index) => {
      const lines = pdf.splitTextToSize(
        `${index + 1}. ${rec}`,
        pageWidth - marginLeft - 20
      );

      // Check for new page
      if (
        yPosition + lines.length * 4 >
        pdf.internal.pageSize.getHeight() - 20
      ) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.text(lines, marginLeft + 5, yPosition);
      yPosition += lines.length * 4 + 3;
    });

    return pdf.output("blob");
  }
}
