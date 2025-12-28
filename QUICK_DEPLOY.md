# Quick Deployment Guide for Hugging Face Spaces

## 🚀 Fastest Way to Deploy (5 minutes)

### Step 1: Create Your Space
1. Go to: https://huggingface.co/new-space
2. Fill in:
   - Space name: `resume-tailor-ai`
   - SDK: **Docker**
   - Hardware: **CPU basic** (free)
   - Click **Create Space**

### Step 2: Clone Your New Space
```powershell
git clone https://huggingface.co/spaces/YOUR_USERNAME/resume-tailor-ai
cd resume-tailor-ai
```

### Step 3: Copy Your Project Files
```powershell
# Copy all files from your project (excluding node_modules and dist)
Copy-Item -Path "C:\Users\pasio\Downloads\resume_tailor_ai\*" -Destination "." -Recurse -Exclude @('node_modules','dist','.git')
```

### Step 4: Add Environment Variables
1. Go to: `https://huggingface.co/spaces/YOUR_USERNAME/resume-tailor-ai/settings`
2. Scroll to **Variables and secrets**
3. Add these secrets:
   - `VITE_HUGGINGFACE_API_KEY` = Your HF API key
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

### Step 5: Deploy
```powershell
git add .
git commit -m "Deploy Resume Tailor AI"
git push
```

### Step 6: Update Supabase Redirect URL
In Supabase Dashboard → Authentication → URL Configuration:
- Add redirect URL: `https://YOUR_USERNAME-resume-tailor-ai.hf.space`

---

## ✅ That's It!

Your app will be live at:
**https://YOUR_USERNAME-resume-tailor-ai.hf.space**

Build takes ~5-10 minutes. Check **Logs** tab for progress.

---

## 📝 Files Included for Deployment

- ✅ `Dockerfile` - Multi-stage build with nginx
- ✅ `nginx.conf` - SPA routing configuration
- ✅ `.dockerignore` - Excludes unnecessary files
- ✅ `HUGGINGFACE_DEPLOYMENT.md` - Full documentation

All set! Just follow the 6 steps above.
