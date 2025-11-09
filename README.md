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

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resume_tailor_ai.git
cd resume_tailor_ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Hugging Face API
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Optional: Supabase (for user management & history)
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: Stripe (for payment integration)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

### 4. Get Your Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/) and create a free account
2. Navigate to Settings → Access Tokens
3. Create a new token with "read" permissions
4. Copy the token to your `.env` file

### 5. (Optional) Set Up Supabase

If you want user authentication and analysis history:

1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Project Settings → API and copy:

   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
4. Run this SQL in the Supabase SQL Editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  subscription TEXT DEFAULT 'free',
  analysis_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  resume JSONB NOT NULL,
  job_description JSONB NOT NULL,
  tailored_output JSONB NOT NULL,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to increment analysis count
CREATE OR REPLACE FUNCTION increment_analysis_count(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET analysis_count = analysis_count + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view own analyses" ON analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own analyses" ON analyses FOR DELETE USING (auth.uid() = user_id);
```

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
resume_tailor_ai/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── FileUpload.tsx
│   │   ├── JobDescriptionForm.tsx
│   │   ├── AnalysisResults.tsx
│   │   └── ScoreCard.tsx
│   ├── pages/              # Main application pages
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── PricingPage.tsx
│   ├── services/           # Business logic & API calls
│   │   ├── huggingface.service.ts
│   │   ├── tailoring.service.ts
│   │   └── supabase.service.ts
│   ├── utils/              # Utility functions
│   │   └── resumeParser.ts
│   ├── types/              # TypeScript type definitions
│   │   └── models.tsx
│   ├── App.tsx             # Main app component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## How It Works

### 1. Resume Parsing

- Supports PDF, DOCX, and TXT formats
- Extracts structured data: name, contact, skills, experience, education, projects, certifications
- Uses pattern matching and text analysis

### 2. Job Description Analysis

- User inputs job title, responsibilities, qualifications, and keywords
- Normalizes and structures the data for comparison

### 3. AI-Powered Matching

The application uses multiple AI models:

- **Skill Matching**: Compares resume skills with job requirements
- **Keyword Analysis**: Identifies important terms and their presence
- **Experience Relevance**: Analyzes action verbs and technical terms
- **Semantic Similarity**: Uses sentence transformers for deep understanding

### 4. Scoring Algorithm

```
Final Score = (Skills Match × 50%) + (Experience Relevance × 30%) + (Keyword Match × 20%)
```

### 5. Recommendations

Generates actionable insights:

- Missing skills to add
- Formatting improvements
- Keyword optimization
- Achievement quantification

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to [Netlify](https://netlify.com)
3. Configure environment variables in Netlify dashboard

## Customization

### Modify AI Models

Edit `src/services/huggingface.service.ts` to use different models:

```typescript
// Example: Change the NER model
const response = await hf.tokenClassification({
  model: 'your-preferred-ner-model',
  inputs: text,
});
```

### Adjust Scoring Weights

Edit `src/services/tailoring.service.ts`:

```typescript
const skillWeight = 0.5;      // 50%
const experienceWeight = 0.3; // 30%
const keywordWeight = 0.2;    // 20%
```

### Customize Styling

Modify `tailwind.config.js` to change colors and theme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

## Security & Privacy

- All analysis happens client-side or via secure APIs
- No resume data is stored without explicit user consent
- Supabase integration uses Row Level Security
- Environment variables keep API keys secure

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions:

- Open an issue on GitHub
- Email: <support@resumetailor.ai>

## Acknowledgments

- Hugging Face for providing excellent ML models
- Supabase for backend infrastructure
- The open-source community for amazing tools

---

**Built for those like me who are annoyed to manually modify the resume**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
