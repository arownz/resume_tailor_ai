# Model Context Protocol (MCP) Configuration Guide

**Last Updated**: November 11, 2025  
**Project**: Resume Tailor AI  
**MCP Spec Version**: 1.0.0

---

## 📋 Overview

This project uses **Model Context Protocol (MCP)** to enhance AI agent capabilities with real-time access to external services, databases, and documentation.

**What is MCP?**
- Protocol for connecting AI agents to external tools
- Provides structured access to APIs, databases, and services
- Enables agents to perform actions (not just generate text)

---

## ✅ Currently Enabled MCPs

### 1. **Hugging Face MCP** 🤗

**Server**: `evalstate/hf-mcp-server`  
**Type**: HTTP  
**URL**: https://huggingface.co/mcp?login  
**Status**: ✅ Active

**Configuration**:
```json
"evalstate/hf-mcp-server": {
  "type": "http",
  "url": "https://huggingface.co/mcp?login",
  "gallery": "https://api.mcp.github.com/2025-09-15/v0/servers/1094d85c-b89b-4a7b-a4da-74718f67d839",
  "version": "1.0.0"
}
```

**Capabilities**:
- `model_search`: Search for ML models by name, task, or author
- `dataset_search`: Find datasets for training/evaluation
- `paper_search`: Search ML research papers (arXiv integration)
- `hub_repo_details`: Get model/dataset metadata
- `hf_doc_search`: Query Hugging Face documentation
- `gr1_flux1_schnell_infer`: Generate images (Flux model)

**Used For**:
- Resume analysis AI model selection
- NER (Named Entity Recognition) for skills extraction
- Semantic similarity for job matching
- Text generation for recommendations

**Authentication**: Logged in as user `arownz`

---

### 2. **Supabase MCP** 🗄️

**Server**: `@supabase/mcp-server-supabase`  
**Type**: stdio  
**Project**: `jsqhgbxkcopylwhcaudk`  
**Status**: ✅ Active

**Configuration**:
```json
"supabase": {
  "command": "cmd",
  "args": [
    "/c",
    "npx",
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--project-ref=jsqhgbxkcopylwhcaudk"
  ],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_1a51341f21cdfc08aa15bd4ccff1f0e8fb5c2b8d"
  },
  "type": "stdio"
}
```

**Capabilities**:
- `execute_sql`: Run SQL queries on database
- `apply_migration`: Create database migrations
- `list_tables`: View table schema and structure
- `list_migrations`: Check migration history
- `get_advisors`: Security and performance recommendations
- `generate_typescript_types`: Auto-generate TypeScript interfaces
- `list_edge_functions`: Manage serverless functions
- `get_publishable_keys`: Retrieve API keys

**Used For**:
- User authentication (auth.users table)
- Profile management (public.profiles table)
- Analysis history (public.analyses table)
- RLS policy management
- Database schema verification

**Authentication**: Access token `sbp_1a51...` (not service_role key for security)

---

### 3. **Upstash Context7** 📚

**Server**: `upstash/context7`  
**Type**: HTTP  
**URL**: https://mcp.context7.com/mcp  
**Status**: ✅ Active

**Configuration**:
```json
"upstash/context7": {
  "type": "http",
  "url": "https://mcp.context7.com/mcp",
  "headers": {
    "CONTEXT7_API_KEY": "ctx7sk-d355c8e0-2379-4d04-8ff8-d8a47f90501a"
  },
  "gallery": "https://api.mcp.github.com/v0/servers/dcec7705-b81b-4e0f-8615-8032604be7ad",
  "version": "1.0.0"
}
```

**Capabilities**:
- `resolve-library-id`: Find library documentation by name
- `get-library-docs`: Fetch up-to-date API docs

**Used For**:
- React/TypeScript documentation lookup
- Vite configuration help
- TailwindCSS class reference
- Third-party library API documentation

**Authentication**: API key `ctx7sk-d355...`

---

### 4. **GitHub MCP** 🐙

**Server**: `github/github-mcp-server`  
**Type**: HTTP  
**URL**: https://api.githubcopilot.com/mcp/  
**Status**: ✅ Active

**Configuration**:
```json
"github/github-mcp-server": {
  "type": "http",
  "url": "https://api.githubcopilot.com/mcp/",
  "gallery": "https://api.mcp.github.com/2025-09-15/v0/servers/ab12cd34-5678-90ef-1234-567890abcdef",
  "version": "0.13.0"
}
```

**Capabilities**:
- Repository metadata access
- Issue and PR management
- Code search across repos
- Branch management

**Used For**:
- Repository operations
- Code search
- Issue tracking

**Authentication**: GitHub Copilot API (scoped to your account)

---

## ⚠️ Enabled But Not Critical

These MCPs are currently enabled but not essential for core functionality:

### **Figma MCP** (Optional)
- **Purpose**: Design tool integration
- **Recommendation**: Can be disabled if not using Figma for design work

### **Sentry MCP** (Optional)
- **Purpose**: Error tracking and monitoring
- **Recommendation**: Enable in production for error reporting

### **Chrome DevTools MCP** (Optional)
- **Purpose**: Browser debugging
- **Recommendation**: Can be disabled for normal development

### **Microsoft MarkItDown** (Optional)
- **Purpose**: Document conversion
- **Recommendation**: Can be disabled (using `pdf-parse` directly)

---

## 🆕 Recommended MCPs to Add

### 1. **Stripe MCP** (High Priority)

**Why**: Your `PricingPage.tsx` has subscription tiers (Free, Pro, Premium) but no payment integration.

**Configuration**:
```json
"stripe": {
  "type": "http",
  "url": "https://mcp.stripe.com",
  "headers": {
    "Authorization": "Bearer sk_test_YOUR_STRIPE_SECRET_KEY"
  }
}
```

**Setup Steps**:
1. Create Stripe account at https://stripe.com
2. Get API keys from Dashboard → Developers → API keys
3. Add to `mcp.json` configuration
4. Install Stripe SDK: `npm install @stripe/stripe-js`

**Features You'll Get**:
- Create checkout sessions
- Manage subscriptions
- Handle webhooks
- Generate invoices
- Track payments

**Code Example**:
```typescript
// src/services/stripe.service.ts
import { loadStripe } from '@stripe/stripe-js';

export class StripeService {
  static async createCheckoutSession(priceId: string) {
    // MCP will help implement this
  }
}
```

---

### 2. **Vercel MCP** (Medium Priority)

**Why**: Simplifies deployment and environment management.

**Configuration**:
```json
"vercel": {
  "type": "stdio",
  "command": "npx",
  "args": [
    "-y",
    "@vercel/mcp-server"
  ]
}
```

**Setup Steps**:
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Add MCP configuration
4. Link project: `vercel link`

**Features You'll Get**:
- Deploy from VS Code
- Manage environment variables
- View deployment logs
- Configure domains
- Access analytics

---

### 3. **Resend MCP** (Low Priority)

**Why**: For sending email notifications (signup confirmations, analysis results).

**Configuration**:
```json
"resend": {
  "type": "http",
  "url": "https://api.resend.com/mcp",
  "headers": {
    "Authorization": "Bearer YOUR_RESEND_API_KEY"
  }
}
```

**Features You'll Get**:
- Transactional emails
- Email templates
- Delivery tracking
- SMTP alternative

---

## 🔧 How to Add New MCPs

### Method 1: Via MCP Gallery (Recommended)

1. Open VS Code
2. Go to Settings → Extensions → GitHub Copilot
3. Search for MCP server in gallery
4. Click "Install"
5. Configure credentials when prompted

### Method 2: Manual Configuration

1. Edit `mcp.json` in `%APPDATA%\Code\User\`
2. Add server configuration:
   ```json
   {
     "servers": {
       "your-mcp-name": {
         "type": "http",
         "url": "https://...",
         "headers": {
           "Authorization": "Bearer YOUR_KEY"
         }
       }
     }
   }
   ```
3. Reload VS Code window
4. Test connection: Agent should see new tools

---

## 🔐 Security Best Practices

### ✅ Do's
- ✅ Store API keys in `mcp.json` (not in code)
- ✅ Use `.gitignore` to exclude `mcp.json` from Git
- ✅ Use least-privilege tokens (anon keys, not service_role)
- ✅ Rotate keys periodically
- ✅ Use environment-specific keys (dev vs. prod)

### ❌ Don'ts
- ❌ Never commit `mcp.json` to Git
- ❌ Don't share API keys in documentation
- ❌ Don't use production keys in development
- ❌ Don't expose service_role keys to client

---

## 🧪 Testing MCP Connections

### Via GitHub Copilot Chat

Ask the agent:
```
Can you check my Supabase database schema using MCP?
```

Agent should respond with table structure from your database.

### Via Terminal

For stdio servers:
```bash
npx @supabase/mcp-server-supabase --project-ref=jsqhgbxkcopylwhcaudk
```

For HTTP servers:
```bash
curl https://huggingface.co/mcp -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 MCP Usage Statistics

Track which MCPs are most used:

| MCP | Usage Frequency | Critical? |
|-----|-----------------|-----------|
| Hugging Face | High (every analysis) | ✅ Yes |
| Supabase | High (auth, storage) | ✅ Yes |
| Context7 | Medium (development) | ⚠️ Optional |
| GitHub | Low (repo ops) | ⚠️ Optional |

---

## 🐛 Troubleshooting

### Issue: "MCP server not responding"

**Causes**:
- Server URL incorrect
- API key expired/invalid
- Network connectivity issues
- Server rate limiting

**Fix**:
1. Check `mcp.json` configuration
2. Verify API keys in respective dashboards
3. Test connection manually (curl/Postman)
4. Check VS Code Output → MCP logs

### Issue: "Permission denied" errors

**Causes**:
- Using wrong API key type (anon vs. service_role)
- RLS policies blocking access
- Insufficient token permissions

**Fix**:
1. Verify token type (should be `sbp_` for Supabase, not `eyJ...`)
2. Check RLS policies in Supabase dashboard
3. Review token permissions/scopes

### Issue: "Rate limit exceeded"

**Causes**:
- Too many API calls
- Hugging Face free tier limit (1,000 req/month)

**Fix**:
1. Implement caching for repeated queries
2. Upgrade to paid tier if needed
3. Use fallback strategies for rate-limited calls

---

## 📚 Additional Resources

- **MCP Specification**: https://modelcontextprotocol.io/
- **Hugging Face MCP Docs**: https://huggingface.co/docs/hub/mcp
- **Supabase MCP GitHub**: https://github.com/supabase/mcp-server-supabase
- **Context7 Documentation**: https://context7.com/docs
- **MCP Gallery**: https://api.mcp.github.com/

---

## 🎯 Next Steps

1. **Test Current MCPs**:
   - Ask Copilot to query Supabase schema
   - Request Hugging Face model recommendations
   - Fetch React documentation via Context7

2. **Add Stripe MCP** (if implementing payments):
   - Create Stripe account
   - Get API keys
   - Configure in `mcp.json`
   - Update `PricingPage.tsx` with checkout flow

3. **Add Vercel MCP** (if deploying):
   - Install Vercel CLI
   - Link project
   - Configure deployment settings

4. **Monitor Usage**:
   - Track API rate limits
   - Review error logs
   - Optimize MCP calls for performance

---

**Questions?** Ask GitHub Copilot to query MCPs for real-time information!

```
Example prompts:
- "Use Supabase MCP to show me my database schema"
- "Use Hugging Face MCP to find NER models"
- "Use Context7 to get React Router v7 documentation"
```
