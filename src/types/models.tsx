// Experience entry with detailed fields for editing
export interface ExperienceEntry {
    id: string;
    title: string;
    company?: string;
    duration?: string;
    description: string;
    bullets?: string[];
    isModified?: boolean;
}

// Education entry with detailed fields
export interface EducationEntry {
    id: string;
    degree: string;
    institution?: string;
    year?: string;
    details?: string;
}

// Structured resume for parsing and editing
export interface Resume {
    name: string;
    contact: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    education: EducationEntry[];
    experience: ExperienceEntry[];
    skills: string[];
    projects: string[];
    certifications?: string[];
}

// Tailored/Modified resume with tracked changes
export interface TailoredResume extends Resume {
    originalResume: Resume;
    modifications: {
        addedSkills: string[];
        removedSkills: string[];
        modifiedExperience: string[]; // IDs of modified experience entries
        modifiedSummary: boolean;
        modifiedEducation: string[]; // IDs of modified education entries
    };
    tailoredForJob: string; // Job title and company as string
    generatedAt: string; // ISO date string
}

export interface JobDescription {
    title: string;
    company?: string;
    responsibilities: string[];
    qualifications: string[];
    keywords: string[];
    rawText?: string;
}

export interface TailoredOutput {
    matchedSkills: string[];
    missingSkills: string[];
    suggestedEdits: string[];
    score: number;
    recommendations: string[];
    coverLetterDraft?: string;
    // New: the actual modified resume content
    tailoredResume?: TailoredResume;
}

export interface AnalysisResult {
    resume: Resume;
    jobDescription: JobDescription;
    tailoredOutput: TailoredOutput;
    timestamp: Date;
}

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    subscription: 'free' | 'premium';
    analysisCount: number;
    createdAt: Date;
}