import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import type { Resume } from "../types/models";

// Configure pdf.js worker for browser environments
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export class ResumeParser {
  /**
   * Parse a PDF file and extract text content
   */
  static async parsePDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += pageText + "\n";
      }

      return fullText;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("Failed to parse PDF file");
    }
  }

  /**
   * Parse a DOCX file and extract text content
   */
  static async parseDOCX(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("Error parsing DOCX:", error);
      throw new Error("Failed to parse DOCX file");
    }
  }

  /**
   * Parse any supported file format
   */
  static async parseFile(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await this.parsePDF(file);
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      return await this.parseDOCX(file);
    } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      return await file.text();
    } else {
      throw new Error(
        "Unsupported file format. Please upload PDF, DOCX, or TXT files."
      );
    }
  }

  /**
   * Extract structured data from resume text using pattern matching
   * This is a basic implementation - can be enhanced with AI models
   */
  static extractStructuredData(text: string): Partial<Resume> {
    const resume: Partial<Resume> = {
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
    };

    // Extract email (basic pattern)
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      resume.contact = emailMatch[0];
    }

    // Extract phone number (basic pattern) - kept for potential future use
    // const phoneMatch = text.match(
    //   /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
    // );

    // Extract name (usually first line or near top)
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length > 0) {
      resume.name = lines[0].trim();
    }

    // Extract education (look for degree keywords)
    const educationKeywords = [
      "bachelor",
      "master",
      "phd",
      "doctorate",
      "associate",
      "diploma",
      "degree",
      "university",
      "college",
      "institute",
    ];

    resume.education = lines.filter((line) =>
      educationKeywords.some((keyword) => line.toLowerCase().includes(keyword))
    );

    // Extract skills (look for skills section)
    const skillsSection = this.extractSection(text, [
      "skills",
      "technical skills",
      "core competencies",
    ]);
    if (skillsSection) {
      // Split by common delimiters
      resume.skills = skillsSection
        .split(/[,;•\n]/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0 && skill.length < 50);
    }

    // Extract experience (look for experience section)
    const experienceSection = this.extractSection(text, [
      "experience",
      "work experience",
      "employment history",
    ]);
    if (experienceSection) {
      // Split by job entries (usually separated by blank lines or dates)
      resume.experience = experienceSection
        .split(/\n\n+/)
        .map((exp) => exp.trim())
        .filter((exp) => exp.length > 20);
    }

    // Extract projects
    const projectsSection = this.extractSection(text, [
      "projects",
      "personal projects",
      "key projects",
    ]);
    if (projectsSection) {
      resume.projects = projectsSection
        .split(/\n\n+/)
        .map((proj) => proj.trim())
        .filter((proj) => proj.length > 20);
    }

    // Extract certifications
    const certsSection = this.extractSection(text, [
      "certifications",
      "certificates",
      "licenses",
    ]);
    if (certsSection) {
      resume.certifications = certsSection
        .split(/\n/)
        .map((cert) => cert.trim())
        .filter((cert) => cert.length > 0 && cert.length < 100);
    }

    return resume;
  }

  /**
   * Extract a specific section from resume text
   */
  private static extractSection(
    text: string,
    sectionHeaders: string[]
  ): string | null {
    const lowerText = text.toLowerCase();

    for (const header of sectionHeaders) {
      const regex = new RegExp(
        `${header}[:\n]([\\s\\S]*?)(?=\\n[A-Z][^\\n]*:|$)`,
        "i"
      );
      const match = lowerText.match(regex);

      if (match && match[1]) {
        // Find the actual text (not lowercased) at this position
        const startIndex = lowerText.indexOf(match[0]);
        const endIndex = startIndex + match[0].length;
        const sectionText = text.substring(startIndex, endIndex);

        // Remove the header line
        return sectionText.split("\n").slice(1).join("\n").trim();
      }
    }

    return null;
  }

  /**
   * Validate if the extracted data looks reasonable
   */
  static validateResume(resume: Partial<Resume>): boolean {
    return !!(
      resume.name &&
      (resume.education?.length ||
        resume.experience?.length ||
        resume.skills?.length)
    );
  }
}
