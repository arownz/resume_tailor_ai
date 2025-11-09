# 🚀 Deployment Guide

This guide covers deploying Resume Tailor AI to production.

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Hugging Face API key working
- [ ] Supabase database set up (optional)
- [ ] Application tested locally
- [ ] Build succeeds without errors
- [ ] No console errors in browser

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest option for React + Vite apps.

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/resume_tailor_ai.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - Click **Environment Variables**
   - Add each variable from your `.env` file:
     ```
     VITE_HUGGINGFACE_API_KEY=your_key_here
     VITE_SUPABASE_URL=your_url_here
     VITE_SUPABASE_ANON_KEY=your_key_here
     ```

6. Click **Deploy**
7. Wait 2-3 minutes for deployment
8. Your app is live! 🎉

### Step 3: Set Up Custom Domain (Optional)

1. Go to your project on Vercel
2. Click **Settings** → **Domains**
3. Add your domain (e.g., `resumetailor.ai`)
4. Follow DNS configuration instructions
5. SSL certificate is auto-generated

## Option 2: Deploy to Netlify

### Step 1: Build Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### Step 2: Deploy

**Method A: Git Integration**

1. Go to [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Connect to GitHub and select repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in **Site settings** → **Environment variables**
6. Click **Deploy site**

**Method B: Manual Deploy**

```bash
# Build the app
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## Option 3: Deploy to GitHub Pages

### Step 1: Install gh-pages

```bash
npm install -D gh-pages
```

### Step 2: Update vite.config.ts

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/resume_tailor_ai/', // Your repo name
});
```

### Step 3: Add Deploy Scripts

Update `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Step 4: Deploy

```bash
npm run deploy
```

Your app will be live at: `https://yourusername.github.io/resume_tailor_ai/`

**Note**: Environment variables won't work on GitHub Pages. You'll need to hardcode them (not recommended for production).

## Option 4: Deploy to Railway

Railway offers great free tier with PostgreSQL included.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Initialize

```bash
# Login
railway login

# Create new project
railway init

# Link to project
railway link
```

### Step 3: Add Environment Variables

```bash
railway variables set VITE_HUGGINGFACE_API_KEY=your_key
railway variables set VITE_SUPABASE_URL=your_url
railway variables set VITE_SUPABASE_ANON_KEY=your_key
```

### Step 4: Deploy

```bash
railway up
```

## Environment Variables

Make sure to set these in your deployment platform:

```env
# Required
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key

# Optional (if using Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (if using Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## Post-Deployment Steps

### 1. Test Your Deployment

- [ ] Homepage loads correctly
- [ ] Can upload resume
- [ ] Can submit job description
- [ ] Analysis results display
- [ ] No console errors
- [ ] Mobile responsive

### 2. Set Up Analytics (Optional)

Add Google Analytics:

```bash
npm install react-ga4
```

In `src/main.tsx`:

```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
```

### 3. Set Up Error Tracking (Optional)

Add Sentry:

```bash
npm install @sentry/react
```

In `src/main.tsx`:

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

### 4. Configure CORS (If needed)

If using external APIs, you may need to configure CORS in your API gateway or use a proxy.

### 5. Set Up CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_HUGGINGFACE_API_KEY: ${{ secrets.HUGGINGFACE_KEY }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Performance Optimization

### 1. Enable Compression

Most platforms enable this by default, but verify in your deployment settings.

### 2. Optimize Images

```bash
# Install image optimization
npm install -D vite-plugin-image-optimizer
```

Update `vite.config.ts`:

```typescript
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer()
  ],
});
```

### 3. Code Splitting

Vite handles this automatically, but you can optimize further:

```typescript
// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

### 4. CDN Configuration

On Vercel/Netlify, assets are automatically served via CDN. No configuration needed!

## Monitoring

### Check Application Health

1. Set up uptime monitoring: [UptimeRobot](https://uptimerobot.com/) (free)
2. Monitor API usage:
   - Hugging Face: Check usage in dashboard
   - Supabase: Monitor database size and API calls

### Performance Metrics

Use [PageSpeed Insights](https://pagespeed.web.dev/) to check:
- Load time
- First Contentful Paint
- Time to Interactive

Aim for scores > 90.

## Troubleshooting Deployment

### Build Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Try building locally
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart deployment after adding variables
- Check platform-specific documentation

### 404 on Page Refresh

Add redirect rules:

**Vercel**: Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify**: Already configured in `netlify.toml`

### CORS Errors

If using external APIs:
1. Check API allows requests from your domain
2. Set up proxy in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://your-api.com',
        changeOrigin: true,
      }
    }
  }
});
```

## Rollback Strategy

### Vercel
1. Go to **Deployments**
2. Find previous working deployment
3. Click **...** → **Promote to Production**

### Netlify
1. Go to **Deploys**
2. Find previous deployment
3. Click **Publish deploy**

### Git-based Rollback
```bash
git revert HEAD
git push
```

## Cost Estimates

### Free Tier (Hobby Projects)
- **Vercel**: Free (100 GB bandwidth/month)
- **Netlify**: Free (100 GB bandwidth/month)
- **Hugging Face**: Free (1,000 requests/month)
- **Supabase**: Free (500 MB database)
- **Total**: $0/month ✅

### Production (Medium Traffic)
- **Vercel Pro**: $20/month
- **Hugging Face Pro**: $9/month
- **Supabase Pro**: $25/month
- **Domain**: $10-15/year
- **Total**: ~$54/month

## Security Checklist

- [ ] Environment variables not committed to Git
- [ ] API keys have appropriate permissions
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] Supabase RLS enabled
- [ ] Rate limiting configured
- [ ] Error messages don't expose sensitive data

## Next Steps

1. ✅ Deploy your application
2. 📊 Set up analytics
3. 🔍 Monitor performance
4. 📧 Collect user feedback
5. 🚀 Iterate and improve!

## Getting a Custom Domain

### Purchase Domain
- [Namecheap](https://www.namecheap.com) - $8-15/year
- [Google Domains](https://domains.google) - $12/year
- [Cloudflare](https://www.cloudflare.com/products/registrar/) - At cost pricing

### Configure DNS
Point your domain to your deployment:
- **Vercel**: A record to `76.76.21.21`
- **Netlify**: CNAME to `your-site.netlify.app`

Wait 24-48 hours for DNS propagation.

## Support

Need help deploying?
- Check platform documentation
- Join Discord communities
- Open an issue on GitHub

---

**Congratulations on deploying your app! 🎉**
