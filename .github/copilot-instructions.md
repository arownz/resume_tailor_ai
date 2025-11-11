# Resume Tailor AI - AI Agent Instructions

## Project Overview

Resume Tailor AI is a React + TypeScript + Vite SaaS that analyzes resumes against job descriptions using Hugging Face ML models. It provides job seekers with match scores, skill gap analysis, and actionable recommendations to optimize their applications.

**Tech Stack**: React 19, TypeScript, Vite, TailwindCSS, Hugging Face Inference API, Supabase (optional), React Router v6

## Architecture & Data Flow

### Three-Layer Architecture

1. **Services Layer** (`src/services/`): Business logic and external API integration

   - `huggingface.service.ts`: ML model inference (NER, classification, similarity)
   - `tailoring.service.ts`: Core resume analysis logic with weighted scoring algorithm
   - `supabase.service.ts`: Optional auth and data persistence
2. **Utils Layer** (`src/utils/`): Pure functions for data transformation

   - `resumeParser.ts`: Extracts structured data from PDF/DOCX/TXT using regex patterns
3. **Components/Pages Layer** (`src/components/`, `src/pages/`): React UI

   - `DashboardPage.tsx`: Main analysis workflow orchestration
   - Smart components handle state, dumb components handle presentation

### Key Data Flow Pattern

```
File Upload → resumeParser → Resume object → TailoringService.analyzeResume() → TailoredOutput → UI Display
```

The analysis pipeline is **asynchronous** and involves multiple API calls. Always handle loading states and errors gracefully.

## Critical Developer Knowledge

### Environment Variables (Required)

All environment variables **must** be prefixed with `VITE_` to be accessible in client-side code:

```env
VITE_HUGGINGFACE_API_KEY=hf_xxxxx  # Required for AI features
VITE_SUPABASE_URL=https://...       # Optional - for auth/storage
VITE_SUPABASE_ANON_KEY=eyJ...       # Optional - for auth/storage
```

Access via: `import.meta.env.VITE_HUGGINGFACE_API_KEY`

### Scoring Algorithm (src/services/tailoring.service.ts)

The match score (0-100) uses weighted averages:

- **50%** Skills match (matched skills / total required skills)
- **30%** Experience relevance (action verb matching)
- **20%** Keyword density (job description terms in resume)

When modifying scoring, preserve these weights or update documentation.

### File Parsing Limitations

`resumeParser.ts` uses **pattern matching** (not ML) for extraction:

- Requires well-formatted resumes with clear section headers
- Section detection: looks for keywords like "SKILLS:", "EXPERIENCE:", etc.
- Falls back to basic extraction if structure is poor
- Always validate with `ResumeParser.validateResume()` before proceeding

### Hugging Face Model Selection

Current models optimized for **free tier** (1,000 requests/month):

- `dslim/bert-base-NER` - Entity extraction (small, fast)
- `sentence-transformers/all-MiniLM-L6-v2` - Semantic similarity (small, fast)
- `gpt2` - Text generation (small, but limited quality)

To upgrade: Replace model names in `huggingface.service.ts`. Larger models (e.g., `bart-large`) require paid tier.

### Supabase Integration (Optional)

Supabase is **NOT required** for core functionality. The app works as a client-only tool. Enable Supabase for:

- User authentication (via `@supabase/supabase-js`)
- Analysis history storage
- Subscription management

Database schema: `profiles` and `analyses` tables with Row Level Security enabled. See `SUPABASE_SETUP.md` for SQL.

## Development Workflows

### Run Development Server

```bash
npm run dev  # Starts Vite dev server on http://localhost:5173
```

### Build for Production

```bash
npm run build    # TypeScript compilation + Vite bundling → dist/
npm run preview  # Test production build locally
```

### Common Development Issues

1. **CSS not applying**: TailwindCSS requires the directives in `index.css`. Verify `@tailwind` imports exist.
2. **Module not found errors**: Vite uses absolute imports from `src/`. Use `../` relative paths or configure path aliases in `tsconfig.json`.
3. **API rate limits**: Hugging Face free tier = 1,000 req/month. Implement caching for repeated analyses.
4. **Type errors in models.tsx**: All interfaces are exported from `src/types/models.tsx`. Import with `type` keyword for type-only imports.

## Project-Specific Conventions

### Component Structure

- **Smart components** (pages): Handle state, API calls, error handling
- **Dumb components**: Pure presentation, receive props only
- All components use React.FC type annotation
- State management: React hooks (no Redux/Context needed for this scale)

### CSS Classes

Custom utility classes in `index.css` and `App.css`:

- `.card` - White background with shadow for content sections
- `.btn-primary` - Primary action button (brand colored)
- `.btn-secondary` - Secondary action button (gray)
- Use Tailwind utilities for everything else

### Error Handling Pattern

Services throw errors, components catch and display:

```typescript
try {
  const result = await TailoringService.analyzeResume(resume, job);
  setResults(result);
} catch (err) {
  setError(err instanceof Error ? err.message : "Unknown error");
}
```

Always provide user-friendly error messages, never expose stack traces.

### File Upload Flow

1. User selects file via `FileUpload` component
2. `ResumeParser.parseFile()` extracts text (async)
3. `ResumeParser.extractStructuredData()` creates Resume object
4. Validate with `ResumeParser.validateResume()`
5. Store in state for analysis

Supported formats: PDF, DOCX, TXT (validated by MIME type + file extension)

## Integration Points

### Hugging Face API

- Uses `@huggingface/inference` SDK
- All methods are async and may throw
- Rate limited to 1,000 requests/month on free tier
- Fallback strategy: Basic pattern matching if API fails

### Supabase (Optional)

- Authentication: Email/password by default
- RLS policies ensure users only see their own data
- `increment_analysis_count()` function called after each analysis
- Profiles auto-created via database trigger on signup

### React Router

Routes defined in `App.tsx`:

- `/` - HomePage (marketing/landing)
- `/dashboard` - DashboardPage (main analysis tool)
- `/pricing` - PricingPage (subscription tiers)

No authentication guards yet - all routes are public.

## Testing & Debugging

### Manual Testing Checklist

1. Upload valid resume (PDF/DOCX/TXT)
2. Verify extracted data displays correctly
3. Submit job description form
4. Confirm analysis runs without errors
5. Check match score and recommendations render
6. Test download results button

### Common Debugging Steps

- **Check browser console** for API errors or parsing failures
- **Verify .env variables** are set and prefixed with `VITE_`
- **Test Hugging Face API** directly at https://huggingface.co/docs/api-inference
- **Inspect network tab** for failed API requests

## Documentation References

- `README.md` - Installation, quick start, project structure
- `HUGGINGFACE_SETUP.md` - API key setup, model selection, rate limits
- `SUPABASE_SETUP.md` - Database schema, RLS policies, authentication
- `DEPLOYMENT.md` - Vercel/Netlify deployment steps

## Code Modification Patterns

### Adding a New ML Model

1. Add method to `HuggingFaceService` in `src/services/huggingface.service.ts`
2. Use appropriate `hf.*` method (e.g., `hf.textClassification()`)
3. Update `TailoringService` to integrate new insights
4. Handle errors with fallback behavior

### Modifying Scoring Weights

Edit `calculateMatchScore()` in `tailoring.service.ts`:

```typescript
const skillWeight = 0.5; // Adjust these
const experienceWeight = 0.3;
const keywordWeight = 0.2;
// Must sum to 1.0
```

### Adding New Resume Sections

1. Update `Resume` interface in `types/models.tsx`
2. Add extraction logic in `resumeParser.ts` → `extractStructuredData()`
3. Add pattern matching for section headers
4. Update UI components to display new data

## Performance Considerations

- **Bundle size**: ~2 MB (acceptable for SaaS). Largest deps: React, Hugging Face SDK, pdf-parse
- **First load**: ~3-5 seconds on slow networks. Consider code splitting for pages if needed
- **AI inference**: 5-15 seconds depending on Hugging Face API latency
- **File parsing**: PDF = 2-5 seconds, DOCX = 1-3 seconds (client-side)

## Security Notes

- **No sensitive data in Git**: `.env` is gitignored
- **API keys client-side**: Hugging Face keys are exposed (read-only, acceptable)
- **Supabase RLS**: Protects user data if enabled
- **No server**: Pure client-side app, all processing in browser or via APIs

## What NOT to Do

Don't add server-side code (this is a static SPA)
Don't expose Supabase service_role key (use anon key only)
Don't commit `.env` files
Don't use `any` types without justification
Don't bypass TypeScript with `@ts-ignore` without comments

## Quick Reference Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Model Context Protocol (MCP) Integration

This project uses **MCP servers** for enhanced AI agent capabilities. The following MCPs are configured in `mcp.json`:

### ✅ **Active & Required MCPs**

#### 1. **Hugging Face MCP** (`evalstate/hf-mcp-server`)
- **Purpose**: AI model inference for resume analysis
- **Configuration**: HTTP server at `https://huggingface.co/mcp`
- **Features Used**:
  - Model search and discovery
  - Dataset access
  - Paper search for ML research
  - Documentation lookup
- **Critical for**: Core resume tailoring functionality
- **API Key**: Authenticated as user `arownz`

#### 2. **Supabase MCP** (`@supabase/mcp-server-supabase`)
- **Purpose**: Database operations, authentication, security
- **Configuration**: 
  ```bash
  Project: jsqhgbxkcopylwhcaudk
  Access Token: sbp_1a51341f21cdfc08aa15bd4ccff1f0e8fb5c2b8d
  ```
- **Features Used**:
  - Execute SQL queries
  - Apply database migrations
  - Manage RLS policies
  - Check security advisors
  - List tables, functions, triggers
- **Critical for**: User authentication, analysis storage, profile management

#### 3. **Upstash Context7** (`upstash/context7`)
- **Purpose**: Real-time library documentation and API references
- **Configuration**: HTTP server with API key `ctx7sk-d355...`
- **Features Used**:
  - Resolve library IDs for documentation
  - Fetch up-to-date docs for React, TypeScript, Vite, etc.
  - Context-aware code examples
- **Useful for**: Developer assistance during coding

#### 4. **GitHub MCP** (`github/github-mcp-server`)
- **Purpose**: Repository management and operations
- **Configuration**: HTTP server via GitHub Copilot API
- **Features Used**:
  - Repo metadata access
  - Issue/PR management
  - Code search
- **Useful for**: Repository-level operations

### ⚠️ **Optional MCPs (Enabled but Not Critical)**

- **Sentry MCP**: Error tracking (configure if production monitoring needed)
- **Figma MCP**: Design tool integration (not needed for this project)
- **Chrome DevTools MCP**: Browser debugging (not needed for this project)
- **MarkItDown MCP**: Document conversion (redundant - we use pdf-parse directly)

### 🆕 **Recommended MCPs to Add**

Consider adding these MCPs for future features:

#### **Stripe MCP** (for subscription payments)
```json
"stripe": {
  "type": "http",
  "url": "https://mcp.stripe.com",
  "headers": {
    "Authorization": "Bearer YOUR_STRIPE_API_KEY"
  }
}
```
**Why**: Your `PricingPage` has subscription tiers. Stripe MCP would enable:
- Payment processing
- Subscription management
- Webhook handling
- Invoice generation

#### **Vercel MCP** (for deployment automation)
```json
"vercel": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@vercel/mcp-server"]
}
```
**Why**: Simplifies deployment workflows:
- Environment variable management
- Deployment previews
- Domain configuration
- Analytics access

### 🔧 **MCP Usage in Development**

When working with AI agents (like GitHub Copilot):

1. **For Hugging Face API issues**: Agent can query model documentation, search datasets, or troubleshoot inference errors
2. **For Supabase database**: Agent can inspect schema, create migrations, optimize RLS policies, or debug auth issues
3. **For library questions**: Agent can fetch latest documentation via Context7 instead of relying on potentially outdated training data

### 🔐 **MCP Security Notes**

- **API Keys**: All MCP credentials stored in `mcp.json` (gitignored)
- **Supabase Access Token**: Read-write access via `sbp_*` token (NOT service_role key)
- **Hugging Face**: Authenticated as user `arownz` with read-only access to public models
- **GitHub**: Uses Copilot API (scoped to your GitHub account)

### 📚 **MCP Documentation**

- **Official MCP Spec**: https://modelcontextprotocol.io/
- **Hugging Face MCP**: https://huggingface.co/docs/hub/mcp
- **Supabase MCP**: https://github.com/supabase/mcp-server-supabase
- **Context7 MCP**: https://context7.com/docs

## When in Doubt

1. Check type definitions in `src/types/models.tsx` for data shapes
2. Review service method signatures for expected inputs/outputs
3. Look at `DashboardPage.tsx` for reference implementation of the full workflow
4. Consult setup docs (`HUGGINGFACE_SETUP.md`, `SUPABASE_SETUP.md`) for integration details
5. **Use MCP tools**: Query Hugging Face for model info, Supabase for database schema, Context7 for library docs
