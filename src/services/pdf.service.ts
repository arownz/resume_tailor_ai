import jsPDF from "jspdf";
import type { Resume, TailoredOutput } from "../types/models";

// Theme color presets
export interface ThemeColor {
  name: string;
  primary: [number, number, number]; // RGB
  text: [number, number, number]; // RGB for header text
}

export const THEME_COLORS: ThemeColor[] = [
  { name: "Rose", primary: [248, 106, 104], text: [255, 255, 255] },
  { name: "Blue", primary: [59, 130, 246], text: [255, 255, 255] },
  { name: "Green", primary: [34, 197, 94], text: [255, 255, 255] },
  { name: "Purple", primary: [147, 51, 234], text: [255, 255, 255] },
  { name: "Orange", primary: [249, 115, 22], text: [255, 255, 255] },
  { name: "Slate", primary: [71, 85, 105], text: [255, 255, 255] },
  { name: "None", primary: [255, 255, 255], text: [0, 0, 0] }, // No header background
];

export class PDFService {
  /**
   * Generate a modified resume PDF based on AI suggestions
   */
  static async generateModifiedResume(
    originalResume: Resume,
    _modifications: TailoredOutput,
    themeColor: ThemeColor = THEME_COLORS[0] // Default to Rose
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

    // Helper for section headers
    const addSectionHeader = (title: string) => {
      yPosition += 5;
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(themeColor.name === "None" ? 0 : themeColor.primary[0], themeColor.name === "None" ? 0 : themeColor.primary[1], themeColor.name === "None" ? 0 : themeColor.primary[2]);
      pdf.text(title.toUpperCase(), marginLeft, yPosition);
      yPosition += 2;
      // Add underline
      pdf.setDrawColor(themeColor.name === "None" ? 200 : themeColor.primary[0], themeColor.name === "None" ? 200 : themeColor.primary[1], themeColor.name === "None" ? 200 : themeColor.primary[2]);
      pdf.setLineWidth(0.5);
      pdf.line(marginLeft, yPosition, pageWidth - marginRight, yPosition);
      yPosition += 5;
      pdf.setTextColor(0, 0, 0);
    };

    // Header with theme color
    if (themeColor.name !== "None") {
      pdf.setFillColor(themeColor.primary[0], themeColor.primary[1], themeColor.primary[2]);
      pdf.rect(0, 0, pageWidth, 35, "F");
      pdf.setTextColor(themeColor.text[0], themeColor.text[1], themeColor.text[2]);
    } else {
      pdf.setTextColor(0, 0, 0);
    }
    
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text(originalResume.name, marginLeft, 22);
    
    // Contact info in header
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const contactParts: string[] = [];
    if (originalResume.email) contactParts.push(originalResume.email);
    if (originalResume.phone) contactParts.push(originalResume.phone);
    if (originalResume.location) contactParts.push(originalResume.location);
    if (contactParts.length > 0) {
      pdf.text(contactParts.join("  |  "), marginLeft, 30);
    }
    
    yPosition = 45;
    pdf.setTextColor(0, 0, 0);

    // Professional Summary (if exists)
    if (originalResume.summary) {
      addSectionHeader("Professional Summary");
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      addText(originalResume.summary, 10);
    }

    // Skills Section
    addSectionHeader("Skills");
    
    // Organize skills nicely
    const allSkills = [...originalResume.skills];
    const skillsText = allSkills.join("  •  ");
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    addText(skillsText, 10);

    // Experience Section
    if (originalResume.experience && originalResume.experience.length > 0) {
      addSectionHeader("Professional Experience");

      originalResume.experience.forEach((exp) => {
        // Job title and company on same line
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(exp.title, marginLeft, yPosition);
        
        if (exp.company) {
          const titleWidth = pdf.getTextWidth(exp.title);
          pdf.setFont("helvetica", "normal");
          pdf.text(` at ${exp.company}`, marginLeft + titleWidth, yPosition);
        }
        yPosition += 5;
        
        // Duration on next line, italicized
        if (exp.duration) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "italic");
          pdf.setTextColor(100, 100, 100);
          pdf.text(exp.duration, marginLeft, yPosition);
          pdf.setTextColor(0, 0, 0);
          yPosition += 5;
        }

        // Description with bullet points
        if (exp.description) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          const descLines = exp.description.split('\n').filter(l => l.trim());
          descLines.forEach(line => {
            const bulletLine = line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`;
            addText(bulletLine, 10);
          });
        }
        yPosition += 3;
      });
    }

    // Education Section
    if (originalResume.education && originalResume.education.length > 0) {
      addSectionHeader("Education");

      originalResume.education.forEach((edu) => {
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "bold");
        pdf.text(edu.degree || "Degree", marginLeft, yPosition);
        yPosition += 5;
        
        if (edu.institution) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(edu.institution, marginLeft, yPosition);
          yPosition += 5;
        }
        if (edu.year) {
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "italic");
          pdf.setTextColor(100, 100, 100);
          pdf.text(edu.year, marginLeft, yPosition);
          pdf.setTextColor(0, 0, 0);
          yPosition += 5;
        }
        yPosition += 3;
      });
    }

    // Projects Section (if exists)
    if (originalResume.projects && originalResume.projects.length > 0) {
      addSectionHeader("Projects");
      
      originalResume.projects.forEach((project) => {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        addText(`• ${project}`, 10);
      });
    }

    // Certifications Section (if exists)
    if (originalResume.certifications && originalResume.certifications.length > 0) {
      addSectionHeader("Certifications");
      
      originalResume.certifications.forEach((cert) => {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        addText(`• ${cert}`, 10);
      });
    }

    // NOTE: AI Recommendations removed from PDF output per user request
    // They are still available in the Analysis Report

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
