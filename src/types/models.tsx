export interface Resume {
    name: string;
    contact: string;
    education: string[];
    experience: string[];
    skills: string[];
    projects: string[];
    certifications?: string[];
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