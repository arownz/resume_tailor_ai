# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

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
