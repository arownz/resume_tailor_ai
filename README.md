# Resume Tailor AI

An AI-powered SaaS application that analyzes resumes against job descriptions to help job seekers optimize their applications and increase their chances of landing interviews.

## Features

- **Smart Resume Parsing**: Upload resumes in PDF, DOCX, or TXT format with automatic text extraction
- **AI-Powered Analysis**: Leverages Hugging Face's machine learning models for intelligent matching
- **Skill Gap Analysis**: Identifies matched and missing skills between your resume and job requirements
- **Match Score**: Provides a 0-100 compatibility score based on multiple factors
- **Actionable Recommendations**: Get specific suggestions to improve your resume for each position
- **Cover Letter Generation**: AI-generated cover letter drafts tailored to the job
- **Beautiful UI**: Modern, responsive interface built with React and TailwindCSS
- **Data Persistence**: Optional Supabase integration for saving analysis history

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Lucide Icons
- **AI/ML**: Hugging Face Inference API
  - Named Entity Recognition (NER)
  - Zero-shot Classification
  - Text Generation
  - Semantic Similarity
- **Document Parsing**: pdf-parse, mammoth (DOCX)
- **Backend**: Supabase (Optional - for auth & data storage)
- **Routing**: React Router v6

## Prerequisites

- Node.js 18+ and npm
- Hugging Face API Key (free tier available)
- Supabase Account (optional - for user management)
