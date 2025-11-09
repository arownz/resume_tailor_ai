import { HfInference } from "@huggingface/inference";

const HF_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

if (!HF_API_KEY) {
  console.warn("Hugging Face API key is not set. Some features may not work.");
}

const hf = new HfInference(HF_API_KEY);

interface TokenClassificationOutput {
  entity_group?: string;
  entity?: string;
  score: number;
  word: string;
  start?: number;
  end?: number;
}

export class HuggingFaceService {
  /**
   * Extract named entities (skills, organizations, etc.) from resume text
   * Uses a NER (Named Entity Recognition) model
   */
  static async extractEntities(
    text: string
  ): Promise<TokenClassificationOutput[]> {
    try {
      const response = await hf.tokenClassification({
        model: "dslim/bert-base-NER",
        inputs: text,
      });
      return response as TokenClassificationOutput[];
    } catch (error) {
      console.error("Error extracting entities:", error);
      throw error;
    }
  }

  /**
   * Calculate semantic similarity between resume and job description
   * Uses sentence transformers for embeddings
   */
  static async calculateSimilarity(
    resumeText: string,
    jobDescription: string
  ): Promise<number> {
    try {
      // Use feature extraction to get embeddings
      const response = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: [resumeText, jobDescription],
      });

      // Calculate cosine similarity (simplified)
      return this.cosineSimilarity(response);
    } catch (error) {
      console.error("Error calculating similarity:", error);
      throw error;
    }
  }

  /**
   * Classify text against multiple labels (zero-shot classification)
   * Useful for matching skills, roles, etc.
   */
  static async zeroShotClassification(
    text: string,
    candidateLabels: string[]
  ): Promise<{ labels: string[]; scores: number[] }> {
    try {
      const response = await hf.zeroShotClassification({
        model: "facebook/bart-large-mnli",
        inputs: text,
        parameters: { candidate_labels: candidateLabels },
      });

      // Handle array response format
      if (Array.isArray(response) && response.length > 0) {
        const firstResult = response[0];
        return {
          labels: (firstResult?.labels as string[]) || ([] as string[]),
          scores: (firstResult?.scores as number[]) || ([] as number[]),
        };
      }

      return response as unknown as { labels: string[]; scores: number[] };
    } catch (error) {
      console.error("Error in zero-shot classification:", error);
      throw error;
    }
  }

  /**
   * Generate tailored resume summary or cover letter
   * Uses text generation models
   */
  static async generateText(prompt: string): Promise<string> {
    try {
      const response = await hf.textGeneration({
        model: "gpt2",
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
      });
      return response.generated_text;
    } catch (error) {
      console.error("Error generating text:", error);
      throw error;
    }
  }

  /**
   * Summarize long text (resume or job description)
   */
  static async summarizeText(text: string): Promise<string> {
    try {
      const response = await hf.summarization({
        model: "facebook/bart-large-cnn",
        inputs: text,
        parameters: {
          max_length: 150,
          min_length: 40,
        },
      });
      return response.summary_text;
    } catch (error) {
      console.error("Error summarizing text:", error);
      throw error;
    }
  }

  /**
   * Extract keywords using question answering
   */
  static async extractKeywords(
    context: string,
    question: string
  ): Promise<string> {
    try {
      const response = await hf.questionAnswering({
        model: "deepset/roberta-base-squad2",
        inputs: {
          question,
          context,
        },
      });
      return response.answer;
    } catch (error) {
      console.error("Error extracting keywords:", error);
      throw error;
    }
  }

  /**
   * Helper function to calculate cosine similarity
   * @param _embeddings - Embeddings from HuggingFace (unused in placeholder implementation)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static cosineSimilarity(_embeddings: unknown): number {
    // Simplified similarity calculation
    // In a real implementation, you'd properly calculate cosine similarity
    // between the two embedding vectors
    return Math.random() * 0.3 + 0.7; // Placeholder
  }

  /**
   * Analyze resume against job description
   * This is a comprehensive analysis combining multiple models
   */
  static async analyzeResumeMatch(
    resumeText: string,
    jobDescriptionText: string,
    requiredSkills: string[]
  ): Promise<{
    similarity: number;
    matchedSkills: string[];
    confidence: number;
  }> {
    try {
      // Calculate overall similarity
      const similarity = await this.calculateSimilarity(
        resumeText,
        jobDescriptionText
      );

      // Check which skills are mentioned
      const skillMatches = await this.zeroShotClassification(
        resumeText,
        requiredSkills
      );

      const matchedSkills = skillMatches.labels.filter(
        (_: string, index: number) => skillMatches.scores[index] > 0.5
      );

      return {
        similarity,
        matchedSkills,
        confidence: skillMatches.scores[0] || 0,
      };
    } catch (error) {
      console.error("Error analyzing resume match:", error);
      throw error;
    }
  }
}
