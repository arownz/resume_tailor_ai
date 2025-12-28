# Deploying Resume Tailor AI to Hugging Face Spaces

## Prerequisites

1. **Hugging Face Account** (Free tier works fine)
   - Sign up at https://huggingface.co/join
   - Get your Hugging Face token from https://huggingface.co/settings/tokens

2. **Git installed** on your computer

3. **Environment Variables** ready:
   - `VITE_HUGGINGFACE_API_KEY` - Your Hugging Face API key
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

---

## Option 1: Docker Space (Recommended for Full Control)

### Step 1: Create a New Space

1. Go to https://huggingface.co/new-space
2. Fill in the details:
   - **Owner**: Your username
   - **Space name**: `resume-tailor-ai`
   - **License**: `mit` (or your choice)
   - **Select the Space SDK**: Choose **Docker**
   - **Space hardware**: `CPU basic` (free tier)
   - **Visibility**: `Public` (or Private if you prefer)
3. Click **Create Space**

### Step 2: Clone the Space Repository

```bash
# Clone the newly created space
git clone https://huggingface.co/spaces/YOUR_USERNAME/resume-tailor-ai
cd resume-tailor-ai
```

### Step 3: Copy Your Project Files

Copy all files from your Resume Tailor AI project to the cloned space directory:

```bash
# On Windows PowerShell (from your project directory)
Copy-Item -Path "C:\Users\pasio\Downloads\resume_tailor_ai\*" -Destination "PATH_TO_CLONED_SPACE\" -Recurse -Force

# Exclude unnecessary files
Remove-Item "PATH_TO_CLONED_SPACE\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "PATH_TO_CLONED_SPACE\dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "PATH_TO_CLONED_SPACE\.git" -Recurse -Force -ErrorAction SilentlyContinue
```

### Step 4: Create README.md with Space Configuration

Create or update `README.md` in the space directory:

```markdown
---
title: Resume Tailor AI
emoji: 📝
colorFrom: pink
colorTo: purple
sdk: docker
pinned: false
app_port: 7860
---

# Resume Tailor AI

Automatically tailor your resume to match job descriptions using AI.

## Features
- AI-powered resume analysis
- Job description matching
- PDF/DOCX export
- Theme customization
- User authentication

## Tech Stack
- React 19 + TypeScript
- Vite
- Hugging Face Inference API
- Supabase Authentication
- TailwindCSS 4
```

### Step 5: Configure Environment Variables in Space Settings

1. Go to your Space settings: `https://huggingface.co/spaces/YOUR_USERNAME/resume-tailor-ai/settings`
2. Scroll to **Variables and secrets**
3. Click **Add a new secret** for each:

   | Name | Value |
   |------|-------|
   | `VITE_HUGGINGFACE_API_KEY` | Your HF API key (hf_xxx) |
   | `VITE_SUPABASE_URL` | Your Supabase URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

4. Mark them as **Secret** (not public)

### Step 6: Update Dockerfile to Use Environment Variables

The Dockerfile is already configured, but make sure environment variables are passed at build time. Update the Dockerfile:

```dockerfile
# Multi-stage build for React + Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_HUGGINGFACE_API_KEY
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables for build
ENV VITE_HUGGINGFACE_API_KEY=$VITE_HUGGINGFACE_API_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the app
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 7860 (required by Hugging Face Spaces)
EXPOSE 7860

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Step 7: Push to Hugging Face

```bash
# Initialize git (if not already done)
git add .
git commit -m "Initial deployment of Resume Tailor AI"

# Push to Hugging Face
git push
```

### Step 8: Wait for Build

1. Go to your Space URL: `https://huggingface.co/spaces/YOUR_USERNAME/resume-tailor-ai`
2. The Space will automatically build (takes 5-10 minutes on free tier)
3. Check the **Logs** tab for build progress
4. Once built, your app will be live!

---

## Option 2: Static Space (Simpler, but requires pre-building)

### Step 1: Build Your App Locally

```bash
# In your project directory
npm run build
```

This creates a `dist/` folder with static files.

### Step 2: Create a Static Space

1. Go to https://huggingface.co/new-space
2. Choose **Static** SDK
3. Name it `resume-tailor-ai`
4. Create the space

### Step 3: Upload Built Files

**Important**: Static spaces don't support environment variables at build time, so you'll need to build locally with your environment variables.

1. Create a `.env.production` file locally:
   ```
   VITE_HUGGINGFACE_API_KEY=hf_xxxxx
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxxxx
   ```

2. Build with production env:
   ```bash
   npm run build
   ```

3. Clone the space and copy built files:
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/resume-tailor-ai
   cd resume-tailor-ai
   
   # Copy dist contents
   Copy-Item -Path "C:\Users\pasio\Downloads\resume_tailor_ai\dist\*" -Destination "." -Recurse -Force
   ```

4. Create `README.md`:
   ```markdown
   ---
   title: Resume Tailor AI
   emoji: 📝
   colorFrom: pink
   colorTo: purple
   sdk: static
   pinned: false
   ---
   ```

5. Push to HF:
   ```bash
   git add .
   git commit -m "Deploy static build"
   git push
   ```

**Limitation**: You'll need to rebuild and redeploy every time you change environment variables.

---

## Option 3: Using Hugging Face CLI (Fastest)

### Install HF CLI

```bash
npm install -g @huggingface/cli
huggingface-cli login
```

### Create and Deploy

```bash
# Create space
huggingface-cli repo create resume-tailor-ai --type space --sdk docker

# Upload files
huggingface-cli upload resume-tailor-ai . --repo-type space
```

---

## Post-Deployment Setup

### 1. Update Supabase Redirect URLs

In your Supabase dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   https://YOUR_USERNAME-resume-tailor-ai.hf.space
   ```

3. Add to **Site URL**:
   ```
   https://YOUR_USERNAME-resume-tailor-ai.hf.space
   ```

### 2. Test Your Deployment

1. Visit `https://YOUR_USERNAME-resume-tailor-ai.hf.space`
2. Test sign up with email
3. Test GitHub OAuth
4. Upload a resume and analyze
5. Check PDF/DOCX downloads

---

## Troubleshooting

### Build Fails

**Check logs**:
```bash
# View build logs in Space → Logs tab
```

**Common issues**:
- Missing environment variables → Add them in Space settings
- Port 7860 not exposed → Check Dockerfile
- Node version mismatch → Use node:20-alpine

### App Doesn't Load

**Check nginx configuration**:
- Ensure `nginx.conf` has `listen 7860`
- Verify SPA routing: `try_files $uri $uri/ /index.html`

### Environment Variables Not Working

**For Docker Space**:
1. Add as **Secrets** in Space settings
2. Reference in Dockerfile as `ARG` and `ENV`
3. Rebuild space (push new commit)

**For Static Space**:
- Must build locally with `.env.production`
- Upload pre-built `dist/` files

### GitHub OAuth Not Working

1. Update Supabase redirect URLs (see above)
2. Check Supabase logs for errors
3. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct

---

## Free Tier Limitations

Hugging Face Free Tier includes:
- ✅ Unlimited public Spaces
- ✅ 2 vCPU, 16GB RAM (persistent)
- ✅ Docker support
- ❌ No GPU access (not needed for this app)
- ❌ Spaces may sleep after inactivity (restart on visit)

Your app will work perfectly on the free tier!

---

## Recommended: Docker Space

**Why Docker over Static?**
- Environment variables managed securely in Space settings
- Automatic builds on git push
- No need to commit built files
- Professional deployment workflow
- Easier to maintain and update

**Follow Option 1 above for the best experience.**

---

## Next Steps

After deployment:
1. Share your Space URL: `https://huggingface.co/spaces/YOUR_USERNAME/resume-tailor-ai`
2. Add to your portfolio/resume
3. Monitor usage in Space analytics
4. Consider upgrading to paid tier if traffic grows

**Your app is now live and accessible worldwide! 🎉**
