import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import type { Resume } from "../types/models";

// Theme color presets (RGB values)
export interface DocxThemeColor {
  name: string;
  hex: string;
}

export const DOCX_THEME_COLORS: DocxThemeColor[] = [
  { name: "Rose", hex: "F86A68" },
  { name: "Blue", hex: "3B82F6" },
  { name: "Green", hex: "22C55E" },
  { name: "Purple", hex: "9333EA" },
  { name: "Orange", hex: "F97316" },
  { name: "Slate", hex: "475569" },
  { name: "None", hex: "000000" },
];

export class DocxService {
  /**
   * Generate a DOCX file from resume data
   */
  static async generateResume(
    resume: Resume,
    themeColorHex: string = "F86A68"
  ): Promise<Blob> {
    const sections: Paragraph[] = [];

    // Header - Name
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.name,
            bold: true,
            size: 48, // 24pt
            color: themeColorHex === "000000" ? "000000" : themeColorHex,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      })
    );

    // Contact Info
    const contactParts: string[] = [];
    if (resume.email) contactParts.push(resume.email);
    if (resume.phone) contactParts.push(resume.phone);
    if (resume.location) contactParts.push(resume.location);

    if (contactParts.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactParts.join("  |  "),
              size: 20, // 10pt
              color: "666666",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        })
      );
    }

    // Helper function for section headers
    const addSectionHeader = (title: string) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 24, // 12pt
              color: themeColorHex === "000000" ? "000000" : themeColorHex,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
          border: {
            bottom: {
              color: themeColorHex === "000000" ? "CCCCCC" : themeColorHex,
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );
    };

    // Professional Summary
    if (resume.summary) {
      addSectionHeader("Professional Summary");
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resume.summary,
              size: 22, // 11pt
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      addSectionHeader("Skills");
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resume.skills.join("  •  "),
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Experience
    if (resume.experience && resume.experience.length > 0) {
      addSectionHeader("Professional Experience");

      resume.experience.forEach((exp) => {
        // Job Title
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.title,
                bold: true,
                size: 24, // 12pt
              }),
              exp.company
                ? new TextRun({
                    text: ` at ${exp.company}`,
                    size: 24,
                  })
                : new TextRun({ text: "" }),
            ],
            spacing: { before: 150, after: 50 },
          })
        );

        // Duration
        if (exp.duration) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.duration,
                  italics: true,
                  size: 20,
                  color: "666666",
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }

        // Description with bullet points
        if (exp.description) {
          const descLines = exp.description.split("\n").filter((l) => l.trim());
          descLines.forEach((line) => {
            const cleanLine = line.replace(/^[•\-]\s*/, "").trim();
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${cleanLine}`,
                    size: 22,
                  }),
                ],
                spacing: { after: 50 },
                indent: { left: 360 }, // 0.25 inch
              })
            );
          });
        }
      });
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      addSectionHeader("Education");

      resume.education.forEach((edu) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree || "Degree",
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 100, after: 50 },
          })
        );

        if (edu.institution) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.institution,
                  size: 22,
                }),
              ],
              spacing: { after: 50 },
            })
          );
        }

        if (edu.year) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.year,
                  italics: true,
                  size: 20,
                  color: "666666",
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
      });
    }

    // Projects
    if (resume.projects && resume.projects.length > 0) {
      addSectionHeader("Projects");

      resume.projects.forEach((project) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${project}`,
                size: 22,
              }),
            ],
            spacing: { after: 50 },
            indent: { left: 360 },
          })
        );
      });
    }

    // Certifications
    if (resume.certifications && resume.certifications.length > 0) {
      addSectionHeader("Certifications");

      resume.certifications.forEach((cert) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `• ${cert}`,
                size: 22,
              }),
            ],
            spacing: { after: 50 },
            indent: { left: 360 },
          })
        );
      });
    }

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720, // 0.5 inch
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: sections,
        },
      ],
    });

    // Generate blob
    const buffer = await Packer.toBlob(doc);
    return buffer;
  }

  /**
   * Download the generated DOCX
   */
  static downloadDocx(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
