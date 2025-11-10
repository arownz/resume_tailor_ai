import type { Resume, JobDescription, TailoredOutput } from "../types/models";
import { HuggingFaceService } from "./huggingface.service";

export class TailoringService {
  /**
   * Main method to analyze resume against job description
   */
  static async analyzeResume(
    resume: Resume,
    jobDescription: JobDescription
  ): Promise<TailoredOutput> {
    try {
      // Convert resume to text
      const resumeText = this.resumeToText(resume);
      const jobText = this.jobDescriptionToText(jobDescription);

      // Extract and analyze skills
      const skillAnalysis = await this.analyzeSkills(
        resume.skills,
        jobDescription.qualifications
      );

      // Calculate overall match score
      const score = await this.calculateMatchScore(
        resumeText,
        jobText,
        skillAnalysis
      );

      // Generate suggestions
      const suggestedEdits = this.generateSuggestions(
        resume,
        jobDescription,
        skillAnalysis
      );

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        resume,
        jobDescription,
        skillAnalysis,
        score
      );

      return {
        matchedSkills: skillAnalysis.matched,
        missingSkills: skillAnalysis.missing,
        suggestedEdits,
        score,
        recommendations,
      };
    } catch (error) {
      console.error("Error analyzing resume:", error);
      throw error;
    }
  }

  /**
   * Analyze skills match between resume and job requirements
   */
  private static async analyzeSkills(
    resumeSkills: string[],
    jobQualifications: string[]
  ): Promise<{
    matched: string[];
    missing: string[];
    matchPercentage: number;
  }> {
    const matched: string[] = [];
    const missing: string[] = [];

    // Normalize skills for comparison
    const normalizedResumeSkills = resumeSkills.map((s) =>
      s.toLowerCase().trim()
    );

    for (const qualification of jobQualifications) {
      const normalizedQual = qualification.toLowerCase().trim();

      // Check for exact or partial matches
      const isMatched = normalizedResumeSkills.some(
        (skill) =>
          skill.includes(normalizedQual) || normalizedQual.includes(skill)
      );

      if (isMatched) {
        matched.push(qualification);
      } else {
        missing.push(qualification);
      }
    }

    const matchPercentage =
      jobQualifications.length > 0
        ? (matched.length / jobQualifications.length) * 100
        : 0;

    return { matched, missing, matchPercentage };
  }

  /**
   * Calculate overall match score (0-100)
   */
  private static async calculateMatchScore(
    resumeText: string,
    jobText: string,
    skillAnalysis: { matchPercentage: number }
  ): Promise<number> {
    try {
      // Weight different factors
      const skillWeight = 0.5;
      const experienceWeight = 0.3;
      const keywordWeight = 0.2;

      // Skills score
      const skillScore = skillAnalysis.matchPercentage;

      // Keyword matching score
      const keywordScore = this.calculateKeywordMatch(resumeText, jobText);

      // Experience relevance (simplified - count matching words)
      const experienceScore = this.calculateExperienceRelevance(
        resumeText,
        jobText
      );

      // Calculate weighted score
      const totalScore =
        skillScore * skillWeight +
        experienceScore * experienceWeight +
        keywordScore * keywordWeight;

      return Math.min(Math.round(totalScore), 100);
    } catch (error) {
      console.error("Error calculating match score:", error);
      return 0;
    }
  }

  /**
   * Calculate keyword match percentage
   */
  private static calculateKeywordMatch(
    resumeText: string,
    jobText: string
  ): number {
    const resumeWords = new Set(
      resumeText
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3)
    );

    const jobWords = jobText
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 3);

    const matchedWords = jobWords.filter((word) => resumeWords.has(word));

    return jobWords.length > 0
      ? (matchedWords.length / jobWords.length) * 100
      : 0;
  }

  /**
   * Calculate experience relevance score
   */
  private static calculateExperienceRelevance(
    resumeText: string,
    jobText: string
  ): number {
    // Extract key action verbs and technical terms from job description
    const actionVerbs = [
      "develop",
      "manage",
      "lead",
      "design",
      "implement",
      "create",
      "analyze",
      "optimize",
      "coordinate",
      "execute",
      "build",
    ];

    const jobLower = jobText.toLowerCase();
    const resumeLower = resumeText.toLowerCase();

    let matches = 0;
    let total = 0;

    actionVerbs.forEach((verb) => {
      if (jobLower.includes(verb)) {
        total++;
        if (resumeLower.includes(verb)) {
          matches++;
        }
      }
    });

    return total > 0 ? (matches / total) * 100 : 50;
  }

  /**
   * Generate actionable suggestions
   */
  private static generateSuggestions(
    resume: Resume,
    jobDescription: JobDescription,
    skillAnalysis: { missing: string[] }
  ): string[] {
    const suggestions: string[] = [];

    // Missing skills suggestions
    if (skillAnalysis.missing.length > 0) {
      const topMissing = skillAnalysis.missing.slice(0, 5);
      suggestions.push(
        `Add the following skills to your resume if you have them: ${topMissing.join(
          ", "
        )}`
      );
    }

    // Experience suggestions
    if (resume.experience.length === 0) {
      suggestions.push(
        "Add relevant work experience that demonstrates your capabilities"
      );
    }

    // Projects suggestion
    if (resume.projects.length === 0) {
      suggestions.push(
        "Include personal or academic projects that showcase relevant skills"
      );
    }

    // Certifications suggestion
    if (
      jobDescription.qualifications.some(
        (q) =>
          q.toLowerCase().includes("certification") ||
          q.toLowerCase().includes("certified")
      ) &&
      (!resume.certifications || resume.certifications.length === 0)
    ) {
      suggestions.push(
        "Consider adding relevant certifications mentioned in the job description"
      );
    }

    // Keywords suggestion
    suggestions.push(
      `Incorporate keywords from the job description: "${jobDescription.title}"`
    );

    // Quantify achievements
    suggestions.push(
      "Quantify your achievements with numbers, percentages, or metrics where possible"
    );

    return suggestions;
  }

  /**
   * Generate detailed recommendations
   */
  private static generateRecommendations(
    resume: Resume,
    _jobDescription: JobDescription,
    skillAnalysis: { matched: string[]; missing: string[] },
    score: number
  ): string[] {
    const recommendations: string[] = [];

    if (score >= 80) {
      recommendations.push(
        "Excellent match! Your resume aligns well with this position."
      );
    } else if (score >= 60) {
      recommendations.push(
        "Good match with room for improvement. Follow the suggestions below."
      );
    } else {
      recommendations.push(
        "Consider significant revisions to better match this position:"
      );
    }

    // Skills recommendations
    if (skillAnalysis.matched.length > 0) {
      recommendations.push(
        `Highlight these matched skills prominently: ${skillAnalysis.matched
          .slice(0, 3)
          .join(", ")}`
      );
    }

    if (skillAnalysis.missing.length > 0) {
      recommendations.push(
        `Consider acquiring or mentioning these skills: ${skillAnalysis.missing
          .slice(0, 3)
          .join(", ")}`
      );
    }

    // Experience recommendations
    if (resume.experience.length > 0) {
      recommendations.push(
        "Tailor your experience descriptions to match the job responsibilities"
      );
    }

    // Format recommendations
    recommendations.push(
      "Use action verbs and quantify achievements in your bullet points"
    );

    recommendations.push(
      "Customize your resume summary/objective to align with this specific role"
    );

    return recommendations;
  }

  /**
   * Convert resume object to plain text
   */
  private static resumeToText(resume: Resume): string {
    return `
      Name: ${resume.name}
      Contact: ${resume.contact}
      
      Skills: ${resume.skills.join(", ")}
      
      Education: ${resume.education.join("\n")}
      
      Experience: ${resume.experience.join("\n")}
      
      Projects: ${resume.projects.join("\n")}
      
      Certifications: ${resume.certifications?.join("\n") || "None"}
    `.trim();
  }

  /**
   * Convert job description to plain text
   */
  private static jobDescriptionToText(jobDescription: JobDescription): string {
    return `
      Title: ${jobDescription.title}
      Company: ${jobDescription.company || "N/A"}
      
      Responsibilities: ${jobDescription.responsibilities.join("\n")}
      
      Qualifications: ${jobDescription.qualifications.join("\n")}
      
      Keywords: ${jobDescription.keywords.join(", ")}
    `.trim();
  }

  /**
   * Generate a tailored cover letter draft using AI
   */
  static async generateCoverLetter(
    resume: Resume,
    jobDescription: JobDescription
  ): Promise<string> {
    try {
      const prompt = `Write a professional cover letter for ${
        resume.name
      } applying for the position of ${jobDescription.title}. 
      
Resume highlights:
- Skills: ${resume.skills.slice(0, 5).join(", ")}
- Experience: ${resume.experience[0] || "Entry level"}

Job requirements:
${jobDescription.qualifications.slice(0, 3).join("\n")}

Write a concise, professional cover letter:`;

      const coverLetter = await HuggingFaceService.generateText(prompt);
      return coverLetter;
    } catch (error) {
      console.error("Error generating cover letter:", error);
      return "Unable to generate cover letter at this time.";
    }
  }
}
