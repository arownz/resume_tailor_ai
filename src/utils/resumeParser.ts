import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import type { Resume, ExperienceEntry, EducationEntry } from "../types/models";

// Configure pdf.js worker for browser environments
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

// Helper to generate unique IDs
const generateId = (): string => Math.random().toString(36).substring(2, 11);

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
   * Returns the new structured Resume format with IDs for each entry
   */
  static extractStructuredData(text: string): Partial<Resume> {
    const lines = text.split("\n").filter((line) => line.trim());
    
    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : undefined;

    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : undefined;

    // Extract name (usually first line)
    const name = lines.length > 0 ? lines[0].trim() : "Unknown";

    // Build contact string
    const contactParts = [email, phone].filter(Boolean);
    const contact = contactParts.join(" | ");

    // Extract summary/objective
    const summarySection = this.extractSection(text, [
      "summary",
      "professional summary",
      "objective",
      "profile",
      "about me"
    ]);

    // Extract education with structure
    const educationRaw = this.extractSection(text, [
      "education",
      "academic background",
      "academic qualifications"
    ]);
    const education: EducationEntry[] = this.parseEducation(educationRaw, lines);

    // Extract experience with structure
    const experienceRaw = this.extractSection(text, [
      "experience",
      "work experience",
      "employment history",
      "professional experience"
    ]);
    const experience: ExperienceEntry[] = this.parseExperience(experienceRaw);

    // Extract skills
    const skillsSection = this.extractSection(text, [
      "skills",
      "technical skills",
      "core competencies",
      "key skills"
    ]);
    const skills = skillsSection
      ? skillsSection
          .split(/[,;•|\n]/)
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0 && skill.length < 50)
      : [];

    // Extract projects
    const projectsSection = this.extractSection(text, [
      "projects",
      "personal projects",
      "key projects"
    ]);
    const projects = projectsSection
      ? projectsSection
          .split(/\n\n+/)
          .map((proj) => proj.trim())
          .filter((proj) => proj.length > 20)
      : [];

    // Extract certifications
    const certsSection = this.extractSection(text, [
      "certifications",
      "certificates",
      "licenses"
    ]);
    const certifications = certsSection
      ? certsSection
          .split(/\n/)
          .map((cert) => cert.trim())
          .filter((cert) => cert.length > 0 && cert.length < 100)
      : [];

    return {
      name,
      contact,
      email,
      phone,
      summary: summarySection?.trim(),
      education,
      experience,
      skills,
      projects,
      certifications,
    };
  }

  /**
   * Parse education section into structured entries
   */
  private static parseEducation(rawSection: string | null, allLines: string[]): EducationEntry[] {
    const educationKeywords = [
      "bachelor", "master", "phd", "doctorate", "associate", 
      "diploma", "degree", "university", "college", "institute", "b.s.", "m.s.", "mba"
    ];

    const entries: EducationEntry[] = [];

    if (rawSection) {
      const eduLines = rawSection.split(/\n/).filter(l => l.trim());
      let currentEntry: Partial<EducationEntry> = {};

      for (const line of eduLines) {
        const lowerLine = line.toLowerCase();
        const hasKeyword = educationKeywords.some(kw => lowerLine.includes(kw));
        
        if (hasKeyword) {
          if (currentEntry.degree) {
            entries.push({
              id: generateId(),
              degree: currentEntry.degree,
              institution: currentEntry.institution,
              year: currentEntry.year,
              details: currentEntry.details
            });
          }
          currentEntry = { degree: line.trim() };
        } else if (currentEntry.degree) {
          // Check for year pattern
          const yearMatch = line.match(/\b(19|20)\d{2}\b/);
          if (yearMatch && !currentEntry.year) {
            currentEntry.year = line.trim();
          } else if (!currentEntry.institution) {
            currentEntry.institution = line.trim();
          } else {
            currentEntry.details = (currentEntry.details || "") + " " + line.trim();
          }
        }
      }

      // Add last entry
      if (currentEntry.degree) {
        entries.push({
          id: generateId(),
          degree: currentEntry.degree,
          institution: currentEntry.institution,
          year: currentEntry.year,
          details: currentEntry.details?.trim()
        });
      }
    }

    // Fallback: scan all lines for education keywords
    if (entries.length === 0) {
      const eduLines = allLines.filter(line =>
        educationKeywords.some(keyword => line.toLowerCase().includes(keyword))
      );
      for (const line of eduLines) {
        entries.push({
          id: generateId(),
          degree: line.trim()
        });
      }
    }

    return entries;
  }

  /**
   * Parse experience section into structured entries
   */
  private static parseExperience(rawSection: string | null): ExperienceEntry[] {
    const entries: ExperienceEntry[] = [];

    if (!rawSection) return entries;

    // Split by double newlines or job-like patterns
    const expBlocks = rawSection.split(/\n{2,}/).filter(block => block.trim().length > 20);

    for (const block of expBlocks) {
      const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;

      // First line is usually title or company
      const firstLine = lines[0];
      const secondLine = lines[1] || "";
      
      // Try to extract duration (date range pattern)
      const durationMatch = block.match(/((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|Present|Current)/i);
      const duration = durationMatch ? durationMatch[0] : undefined;

      // Build description from remaining lines
      const descLines = lines.slice(1).filter(l => 
        !l.match(/^((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/i)
      );
      
      // Extract bullet points
      const bullets = descLines.filter(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"));
      const description = descLines.join("\n");

      entries.push({
        id: generateId(),
        title: firstLine,
        company: secondLine.length > 0 && !secondLine.startsWith("•") ? secondLine : undefined,
        duration,
        description,
        bullets: bullets.length > 0 ? bullets.map(b => b.replace(/^[•\-*]\s*/, "")) : undefined
      });
    }

    return entries;
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
