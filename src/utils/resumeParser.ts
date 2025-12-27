import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import type { Resume, ExperienceEntry, EducationEntry } from "../types/models";
import { HuggingFaceService } from "../services/huggingface.service";

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
   * Handles both structured resumes AND narrative-style descriptions
   */
  static extractStructuredData(text: string): Partial<Resume> {
    // Log raw text length for debugging
    console.log('[ResumeParser] Text length:', text.length, 'chars');
    console.log('[ResumeParser] First 200 chars:', text.substring(0, 200));
    
    const lines = text.split("\n").filter((line) => line.trim());
    
    // Check if this is a narrative-style "Name: ..." format
    const isNarrativeFormat = text.startsWith("Name:") || /^Name:\s*/.test(text);
    
    if (isNarrativeFormat) {
      console.log('[ResumeParser] Detected narrative format');
      return this.parseNarrativeFormat(text);
    }
    
    console.log('[ResumeParser] Using structured format parser');
    
    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : undefined;

    // Extract phone - improved pattern
    const phonePatterns = [
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
      /\d{3}[-.\s]\d{3}[-.\s]\d{4}/,
      /\(\d{3}\)\s*\d{3}[-.\s]\d{4}/
    ];
    let phone: string | undefined;
    for (const pattern of phonePatterns) {
      const match = text.match(pattern);
      if (match) {
        phone = match[0];
        break;
      }
    }

    // Extract name - try multiple strategies
    let name = "Unknown";
    
    // Strategy 1: Look for "Name:" field
    const nameFieldMatch = text.match(/Name:\s*([^\n,]+)/i);
    if (nameFieldMatch) {
      name = nameFieldMatch[1].trim();
    } 
    // Strategy 2: First line if it looks like a name (Title Case, short)
    else if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Check if first line looks like a name (not a header like "RESUME" or section name)
      const looksLikeName = firstLine.length < 50 && 
        firstLine.length > 2 &&
        !firstLine.match(/^(resume|curriculum|cv|profile|summary|experience|education|skills)/i) &&
        !firstLine.match(/^[A-Z\s]+$/) && // Not all caps
        firstLine.match(/^[A-Z][a-zA-Z]+/); // Starts with capital letter
      
      if (looksLikeName) {
        name = firstLine;
      } else {
        // Try second line
        const secondLine = lines[1]?.trim() || '';
        if (secondLine.length > 2 && secondLine.length < 50 && !secondLine.match(/^(resume|cv|profile)/i)) {
          name = secondLine;
        }
      }
    }
    
    console.log('[ResumeParser] Extracted name:', name);

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
    console.log('[ResumeParser] Summary section found:', !!summarySection);

    // Extract education with structure
    const educationRaw = this.extractSection(text, [
      "education",
      "academic background",
      "academic qualifications"
    ]);
    console.log('[ResumeParser] Education section found:', !!educationRaw);
    const education: EducationEntry[] = this.parseEducation(educationRaw, lines);
    console.log('[ResumeParser] Education entries:', education.length);

    // Extract experience with structure
    const experienceRaw = this.extractSection(text, [
      "experience",
      "work experience",
      "employment history",
      "professional experience"
    ]);
    console.log('[ResumeParser] Experience section found:', !!experienceRaw);
    const experience: ExperienceEntry[] = this.parseExperience(experienceRaw);
    console.log('[ResumeParser] Experience entries:', experience.length);

    // Extract skills - improved parsing
    const skillsSection = this.extractSection(text, [
      "skills",
      "technical skills",
      "core competencies",
      "key skills",
      "competencies",
      "technologies",
      "tools"
    ]);
    
    let skills: string[] = [];
    if (skillsSection) {
      // Handle various formats: comma-separated, bullet points, pipe-separated, newlines
      skills = skillsSection
        .split(/[,;•●|▪︎◦\n]/)
        .map((skill) => skill.trim())
        .map((skill) => skill.replace(/^[-\*]\s*/, '')) // Remove leading dashes/asterisks
        .filter((skill) => skill.length > 1 && skill.length < 60)
        .filter((skill) => !skill.match(/^(and|or|the|a|an)$/i)); // Remove common words
    }
    
    // If no skills found via section, try to extract from entire text using keywords
    if (skills.length === 0) {
      const techKeywords = [
        "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "Go", "Rust", "PHP",
        "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask", "Spring",
        "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", "Linux",
        "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase",
        "Git", "GitHub", "GitLab", "CI/CD", "Jenkins", "Terraform",
        "HTML", "CSS", "SASS", "Tailwind", "Bootstrap",
        "REST", "GraphQL", "API", "Microservices",
        "Agile", "Scrum", "Jira", "Confluence",
        "Machine Learning", "AI", "TensorFlow", "PyTorch",
        "Unity", "Godot", "Unreal",
        "Blockchain", "Web3", "Solidity"
      ];
      
      for (const keyword of techKeywords) {
        const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(text) && !skills.includes(keyword)) {
          skills.push(keyword);
        }
      }
    }
    
    console.log('[ResumeParser] Skills found:', skills.length);

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

    const result = {
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
    
    console.log('[ResumeParser] Final result:', {
      name: result.name,
      hasEmail: !!result.email,
      hasPhone: !!result.phone,
      educationCount: result.education.length,
      experienceCount: result.experience.length,
      skillsCount: result.skills.length
    });
    
    return result;
  }

  /**
   * Parse education section into structured entries
   * Handles various formats: multi-line, single-line, bullet points
   */
  private static parseEducation(rawSection: string | null, allLines: string[]): EducationEntry[] {
    const educationKeywords = [
      "bachelor", "master", "phd", "doctorate", "associate", 
      "diploma", "degree", "university", "college", "institute", 
      "b.s.", "m.s.", "mba", "b.a.", "m.a.", "b.sc", "m.sc",
      "high school", "secondary", "certification"
    ];

    const entries: EducationEntry[] = [];

    if (rawSection) {
      // Try splitting by common patterns
      // Pattern 1: Double newline separation
      let blocks = rawSection.split(/\n\s*\n/).filter(b => b.trim().length > 5);
      
      // Pattern 2: If only one block, try bullet/dash separation
      if (blocks.length <= 1) {
        blocks = rawSection.split(/\n(?=[•\-\*]|\d{4})/).filter(b => b.trim().length > 5);
      }
      
      // Pattern 3: If still one block, split by lines that look like degree names
      if (blocks.length <= 1) {
        const lines = rawSection.split('\n').filter(l => l.trim());
        blocks = [];
        let currentBlock = '';
        
        for (const line of lines) {
          const lowerLine = line.toLowerCase();
          const hasEducationKeyword = educationKeywords.some(kw => lowerLine.includes(kw));
          
          if (hasEducationKeyword && currentBlock) {
            blocks.push(currentBlock.trim());
            currentBlock = line;
          } else {
            currentBlock += '\n' + line;
          }
        }
        if (currentBlock.trim()) blocks.push(currentBlock.trim());
      }

      for (const block of blocks) {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) continue;

        // Find the degree line
        let degreeLine = '';
        let institutionLine = '';
        let yearLine = '';
        let details = '';

        for (const line of lines) {
          const lowerLine = line.toLowerCase();
          const hasKeyword = educationKeywords.some(kw => lowerLine.includes(kw));
          const yearMatch = line.match(/\b(19|20)\d{2}\b/);
          
          if (hasKeyword && !degreeLine) {
            degreeLine = line;
          } else if (yearMatch && !yearLine) {
            yearLine = line;
          } else if (!institutionLine && line.length > 3 && !line.startsWith('•') && !line.startsWith('-')) {
            institutionLine = line;
          } else if (line.length > 3) {
            details += (details ? ' ' : '') + line;
          }
        }

        // Extract year from degree line if not found separately
        if (!yearLine && degreeLine) {
          const yearInDegree = degreeLine.match(/\b(19|20)\d{2}\b/);
          if (yearInDegree) {
            yearLine = yearInDegree[0];
          }
        }

        if (degreeLine || institutionLine) {
          entries.push({
            id: generateId(),
            degree: degreeLine || institutionLine,
            institution: degreeLine ? institutionLine : undefined,
            year: yearLine?.match(/\b(19|20)\d{2}\b/)?.[0],
            details: details || undefined
          });
        }
      }
    }

    // Fallback: scan all lines for education keywords
    if (entries.length === 0) {
      const eduLines = allLines.filter(line =>
        educationKeywords.some(keyword => line.toLowerCase().includes(keyword))
      );
      for (const line of eduLines.slice(0, 3)) { // Limit to 3 entries
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        entries.push({
          id: generateId(),
          degree: line.trim(),
          year: yearMatch ? yearMatch[0] : undefined
        });
      }
    }

    return entries;
  }

  /**
   * Parse experience section into structured entries
   * Handles various formats: chronological, functional, mixed
   */
  private static parseExperience(rawSection: string | null): ExperienceEntry[] {
    const entries: ExperienceEntry[] = [];

    if (!rawSection) return entries;

    // Normalize the section
    const normalizedSection = rawSection
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .trim();

    // Try different splitting strategies
    
    // Strategy 1: Split by date patterns (most common in formatted resumes)
    const datePattern = /\n(?=.*?\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*\.?\s*\d{4}|\d{4}\s*[-–—]\s*(?:\d{4}|Present|Current))/gi;
    let expBlocks = normalizedSection.split(datePattern).filter(block => block.trim().length > 15);
    
    // Strategy 2: Split by double newlines
    if (expBlocks.length <= 1) {
      expBlocks = normalizedSection.split(/\n\s*\n/).filter(block => block.trim().length > 15);
    }
    
    // Strategy 3: Split by lines that look like job titles (Title Case followed by company indicators)
    if (expBlocks.length <= 1) {
      const lines = normalizedSection.split('\n');
      expBlocks = [];
      let currentBlock = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Check if this looks like a job title line (Title Case, not a bullet)
        const looksLikeTitle = /^[A-Z][a-zA-Z\s]+(?:Developer|Engineer|Manager|Analyst|Designer|Specialist|Lead|Director|Coordinator|Assistant|Intern)/.test(line);
        const isNotBullet = !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*');
        
        if (looksLikeTitle && isNotBullet && currentBlock) {
          expBlocks.push(currentBlock.trim());
          currentBlock = line;
        } else {
          currentBlock += '\n' + line;
        }
      }
      if (currentBlock.trim()) expBlocks.push(currentBlock.trim());
    }

    for (const block of expBlocks) {
      const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) continue;

      // Parse the block
      let title = '';
      let company = '';
      let duration = '';
      const descriptionLines: string[] = [];
      const bullets: string[] = [];

      // First, try to find duration in the block
      const durationMatch = block.match(/((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*\.?\s*\d{4})\s*[-–—to]+\s*((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*\.?\s*\d{4}|Present|Current)/i)
        || block.match(/\b(\d{4})\s*[-–—]\s*(\d{4}|Present|Current)\b/i);
      
      if (durationMatch) {
        duration = durationMatch[0];
      }

      // Parse lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip if this is the duration line we already captured
        if (duration && line.includes(duration)) {
          // Extract non-duration part of the line
          const nonDurationPart = line.replace(duration, '').trim();
          if (nonDurationPart && !title) {
            title = nonDurationPart;
          }
          continue;
        }

        // Check for bullets
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || line.startsWith('●')) {
          bullets.push(line.replace(/^[•\-\*●]\s*/, ''));
          continue;
        }

        // First substantial line is usually title
        if (!title && line.length > 3 && i < 3) {
          title = line;
          continue;
        }

        // Second substantial line is usually company
        if (title && !company && line.length > 2 && i < 4 && !line.match(/^\d{4}/)) {
          company = line;
          continue;
        }

        // Rest goes to description
        if (line.length > 5) {
          descriptionLines.push(line);
        }
      }

      // Build description
      const description = bullets.length > 0 
        ? bullets.map(b => '• ' + b).join('\n')
        : descriptionLines.join('\n');

      if (title || company) {
        entries.push({
          id: generateId(),
          title: title || company || 'Position',
          company: title ? (company || undefined) : undefined,
          duration: duration || undefined,
          description: description || undefined,
          bullets: bullets.length > 0 ? bullets : undefined,
          isModified: false
        });
      }
    }

    return entries;
  }

  /**
   * Extract a specific section from resume text
   * Improved to handle various resume formats (multi-column, formatted, etc.)
   */
  private static extractSection(
    text: string,
    sectionHeaders: string[]
  ): string | null {
    // Normalize text - handle multiple spaces and weird characters
    const normalizedText = text
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ');
    
    const lines = normalizedText.split('\n');
    
    // Find section by looking for header line
    for (const header of sectionHeaders) {
      const headerRegex = new RegExp(`^\\s*${header}\\s*[:.]?\\s*$`, 'i');
      const inlineHeaderRegex = new RegExp(`^\\s*${header}\\s*[:.\\s]`, 'i');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if this line is a section header
        if (headerRegex.test(line) || inlineHeaderRegex.test(line.toLowerCase())) {
          // Collect content until next section header
          const sectionContent: string[] = [];
          const nextSectionPattern = /^[A-Z][A-Z\s]+[:.]*$/; // All caps header pattern
          const commonHeaders = [
            'education', 'experience', 'skills', 'projects', 'certifications',
            'summary', 'objective', 'work history', 'employment', 'qualifications',
            'achievements', 'awards', 'references', 'contact', 'profile',
            'technical skills', 'professional experience', 'work experience'
          ];
          
          for (let j = i + 1; j < lines.length; j++) {
            const contentLine = lines[j].trim();
            
            // Check if we've hit another section
            const isNextSection = commonHeaders.some(h => 
              contentLine.toLowerCase() === h ||
              contentLine.toLowerCase().startsWith(h + ':') ||
              contentLine.toLowerCase().startsWith(h + ' ')
            ) || nextSectionPattern.test(contentLine);
            
            if (isNextSection && contentLine.length < 50) {
              break;
            }
            
            if (contentLine) {
              sectionContent.push(contentLine);
            }
          }
          
          if (sectionContent.length > 0) {
            return sectionContent.join('\n');
          }
        }
      }
    }

    // Fallback: Try to find content near keywords
    for (const header of sectionHeaders) {
      const keywordIndex = normalizedText.toLowerCase().indexOf(header.toLowerCase());
      if (keywordIndex !== -1) {
        // Get text after the keyword until double newline or next section
        const afterKeyword = normalizedText.substring(keywordIndex + header.length);
        const endMatch = afterKeyword.match(/\n\s*\n\s*[A-Z][A-Z\s]+[:.]/);
        const endIndex = endMatch ? endMatch.index : Math.min(afterKeyword.length, 2000);
        const content = afterKeyword.substring(0, endIndex).replace(/^[:\s]+/, '').trim();
        
        if (content.length > 10) {
          return content;
        }
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
      resume.name !== "Unknown" &&
      (resume.education?.length ||
        resume.experience?.length ||
        resume.skills?.length)
    );
  }

  /**
   * AI-enhanced resume parsing using HuggingFace NER
   * Falls back to pattern matching if AI is unavailable
   */
  static async extractStructuredDataWithAI(text: string): Promise<Partial<Resume>> {
    // First, get basic extraction
    const basicResult = this.extractStructuredData(text);
    
    // If HuggingFace is not available, return basic result
    if (!HuggingFaceService.isAvailable()) {
      console.log('[ResumeParser] HuggingFace not available, using pattern matching only');
      return basicResult;
    }
    
    try {
      console.log('[ResumeParser] Enhancing extraction with AI...');
      
      // Use NER to extract entities
      const entities = await HuggingFaceService.enhanceResumeExtraction(text);
      
      console.log('[ResumeParser] AI entities found:', entities);
      
      // Enhance name if not found or is "Unknown"
      if ((!basicResult.name || basicResult.name === "Unknown") && entities.persons.length > 0) {
        // First person entity is likely the resume owner's name
        basicResult.name = entities.persons[0];
        console.log('[ResumeParser] AI enhanced name:', basicResult.name);
      }
      
      // Enhance organizations (could be companies in experience)
      if (entities.organizations.length > 0 && basicResult.experience) {
        // Add organizations as potential companies
        for (let i = 0; i < basicResult.experience.length && i < entities.organizations.length; i++) {
          if (!basicResult.experience[i].company) {
            basicResult.experience[i].company = entities.organizations[i];
          }
        }
      }
      
      // Add location if found
      if (entities.locations.length > 0 && !basicResult.location) {
        basicResult.location = entities.locations.join(', ');
      }
      
      return basicResult;
    } catch (error) {
      console.error('[ResumeParser] AI enhancement failed, using basic result:', error);
      return basicResult;
    }
  }

  /**
   * Parse narrative-style CV description (e.g., "Name: John Doe. John is a...")
   * This handles unstructured text that describes a person in paragraph form
   */
  private static parseNarrativeFormat(text: string): Partial<Resume> {
    // Extract name from "Name: Lastname, Firstname" or "Name: Firstname Lastname"
    let name = "Unknown";
    const nameMatch = text.match(/Name:\s*([^.]+?)(?:\.|\s+[A-Z][a-z]+\s+is)/i);
    if (nameMatch) {
      name = nameMatch[1].trim();
      // Handle "Lastname, Firstname" format
      if (name.includes(",")) {
        const parts = name.split(",").map(p => p.trim());
        name = `${parts[1]} ${parts[0]}`;
      }
    }

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : undefined;

    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : undefined;

    // Extract location (look for city/state patterns)
    const locationMatch = text.match(/from\s+([A-Z][a-z]+(?:,?\s+[A-Z][a-z]+)?)/i);
    const location = locationMatch ? locationMatch[1] : undefined;

    // Extract education - look for degree patterns
    const education: EducationEntry[] = [];
    const degreePatterns = [
      /Bachelor\s+(?:of\s+)?(?:Science|Arts|Engineering)\s+(?:in\s+)?([^,]+?)(?:,|\s+at|\s+from)/gi,
      /B\.?S\.?\s+(?:in\s+)?([^,]+?)(?:,|\s+at)/gi,
      /pursuing\s+(?:a\s+)?([^,]+?)(?:,|\s+at|\s+specializing)/gi,
      /([A-Z][a-z]+\s+(?:of\s+)?(?:Science|Arts|Engineering)\s+in\s+[^,]+)/gi
    ];
    
    for (const pattern of degreePatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const degreeText = match[0];
        // Extract institution
        const instMatch = text.match(new RegExp(degreeText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^.]*?(?:at|from)\\s+([^,–—.]+)', 'i'));
        // Extract year
        const yearMatch = text.match(/graduating\s+(?:in\s+)?(\d{4})/i) || text.match(/(\d{4})(?:\s*[-–—]\s*(?:\d{4}|present|current))?/i);
        
        education.push({
          id: generateId(),
          degree: degreeText.trim(),
          institution: instMatch ? instMatch[1].trim() : undefined,
          year: yearMatch ? yearMatch[1] : undefined
        });
        break; // Only take first match
      }
      if (education.length > 0) break;
    }

    // Fallback education extraction
    if (education.length === 0) {
      const eduMatch = text.match(/(?:Bachelor|Master|PhD|B\.?S\.?|M\.?S\.?)[^.]+/i);
      if (eduMatch) {
        const yearMatch = text.match(/graduating\s+(?:in\s+)?(\d{4})/i);
        education.push({
          id: generateId(),
          degree: eduMatch[0].trim(),
          year: yearMatch ? yearMatch[1] : undefined
        });
      }
    }

    // Extract skills from the narrative
    const skills: string[] = [];
    const skillPatterns = [
      /expertise\s+in\s+([^.]+)/gi,
      /proficient\s+in\s+([^.]+)/gi,
      /experience\s+with\s+([^.]+)/gi,
      /adept\s+in\s+([^.]+)/gi,
      /skills?\s+(?:include|including|in)\s+([^.]+)/gi,
      /tools?\s+(?:and\s+)?technologies?\s+(?:include|including)?\s*([^.]+)/gi
    ];

    for (const pattern of skillPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const skillText = match[1];
        // Split by common delimiters
        const extracted = skillText
          .split(/[,;]|\s+and\s+|\s+as well as\s+/i)
          .map(s => s.trim())
          .filter(s => s.length > 1 && s.length < 50);
        skills.push(...extracted);
      }
    }

    // Extract specific tech mentions
    const techKeywords = [
      "React", "TypeScript", "JavaScript", "Python", "Java", "Node.js",
      "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes",
      "Git", "GitHub", "Unity", "Godot", "Blockchain", "AI",
      "Full Stack", "Backend", "Frontend", "Mobile", "Web Development",
      "API", "REST", "GraphQL", "SQL", "MongoDB", "PostgreSQL",
      "Scrum", "Agile", "CI/CD", "DevOps"
    ];
    
    for (const tech of techKeywords) {
      if (text.toLowerCase().includes(tech.toLowerCase()) && !skills.some(s => s.toLowerCase().includes(tech.toLowerCase()))) {
        skills.push(tech);
      }
    }

    // Extract experience/projects from narrative
    const experience: ExperienceEntry[] = [];
    
    // Look for project mentions like "Lexia —a gamified..."
    const projectMatch = text.match(/([A-Z][a-z]+)\s*[—–-]\s*a\s+([^.]+)/i);
    if (projectMatch) {
      const projectDesc = text.match(new RegExp(`In\\s+${projectMatch[1]}[^.]*\\.`, 'i'));
      experience.push({
        id: generateId(),
        title: `Project: ${projectMatch[1]}`,
        description: projectMatch[2] + (projectDesc ? " " + projectDesc[0] : ""),
        isModified: false
      });
    }

    // Look for role mentions
    const roleMatch = text.match(/serving\s+as\s+(?:the\s+)?([^,]+)/i);
    if (roleMatch) {
      const teamMatch = text.match(/team'?s?\s+([^,]+?)(?:,|project)/i);
      experience.push({
        id: generateId(),
        title: roleMatch[1].trim(),
        company: teamMatch ? `${teamMatch[1]} Project` : undefined,
        description: "Led development and system architecture",
        isModified: false
      });
    }

    // Extract summary - use the main descriptive paragraph
    let summary = "";
    const summaryMatch = text.match(/(?:is\s+(?:an?|the)\s+)?([A-Z][^.]+(?:major|professional|developer|engineer|specialist)[^.]*\.)/i);
    if (summaryMatch) {
      summary = summaryMatch[0];
    }

    // Extract career interests
    const interestsMatch = text.match(/seeks?\s+opportunities?\s+in\s+([^.]+)/i);
    if (interestsMatch && summary) {
      summary += " " + interestsMatch[0] + ".";
    }

    return {
      name,
      contact: [email, phone].filter(Boolean).join(" | "),
      email,
      phone,
      location,
      summary: summary || undefined,
      education,
      experience,
      skills: [...new Set(skills)], // Remove duplicates
      projects: [],
      certifications: []
    };
  }
}
