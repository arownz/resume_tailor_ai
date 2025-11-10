# 🔐 OAuth Setup Guide for Resumay Tailor Swift

## Supabase Project Details

- **Project URL**: `https://hiivmcadmcjjksxpckdw.supabase.co`
- **Callback URL**: `https://hiivmcadmcjjksxpckdw.supabase.co/auth/v1/callback`

---

## 🔵 Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing: **"Resumay Tailor Swift"**
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Configure Consent Screen**:

   - Choose **External** user type
   - Fill in:
     - App name: `Resumay Tailor Swift`
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Save and continue

5. Go back to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
6. Configure:
   - **Application type**: Web application
   - **Name**: Resumay Tailor Swift Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     https://your-production-domain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://hiivmcadmcjjksxpckdw.supabase.co/auth/v1/callback
     http://localhost:5173
     ```
7. Click **Create**
8. Copy your **Client ID** and **Client Secret**

### Step 2: Configure in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **hiivmcadmcjjksxpckdw**
3. Navigate to **Authentication** → **Providers** → **Google**
4. Toggle **Enable Sign in with Google**: ✅ **ON**
5. Fill in:
   - **Client ID**: `xxxxx.apps.googleusercontent.com` (from Google Console)
   - **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx` (from Google Console)
   - **Skip nonce checks**: ❌ OFF (recommended)
   - **Allow users without an email**: ❌ OFF (recommended)
6. Click **Save**

### Example Google Credentials Format:

```
Client ID: 123456789-abcdefghijklmnop.apps.googleusercontent.com
Client Secret: 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
```

---

## ⚫ GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `Resumay Tailor Swift`
   - **Homepage URL**:
     - Dev: `http://localhost:5173`
     - Prod: `https://your-production-domain.com`
   - **Application description**: AI-powered resume tailoring tool
   - **Authorization callback URL**:
     ```
     https://hiivmcadmcjjksxpckdw.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. On the app page:
   - Copy the **Client ID**
   - Click **Generate a new client secret**
   - Copy the **Client Secret** (you can only see this once!)

### Step 2: Configure in Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **hiivmcadmcjjksxpckdw**
3. Navigate to **Authentication** → **Providers** → **GitHub**
4. Toggle **GitHub enabled**: ✅ **ON**
5. Fill in:
   - **Client ID**: `Ov23liXxXxXxXxXxXxXx` (from GitHub)
   - **Client Secret**: `abc123def456ghi789jkl...` (from GitHub)
   - **Allow users without an email**: ❌ OFF (recommended)
6. Click **Save**

### Example GitHub Credentials Format:

```
Client ID: Ov23liXxXxXxXxXxXxXx
Client Secret: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
```

---

## 🧪 Testing OAuth Flow

### Local Development Testing

1. **Start your dev server**:

   ```bash
   npm run dev
   ```

2. **Navigate to**: `http://localhost:5173/auth`

3. **Test Google OAuth**:

   - Click "Continue with Google"
   - Should redirect to Google sign-in
   - After auth, redirects back to your app

4. **Test GitHub OAuth**:
   - Click "Continue with GitHub"
   - Should redirect to GitHub authorization
   - After auth, redirects back to your app

### Production Testing

1. Deploy your app to production (Vercel/Netlify)
2. Update redirect URIs in Google/GitHub OAuth apps with production URL
3. Test same flow on production domain

---

## ⚠️ Common Issues & Fixes

### Issue: "Invalid characters" in Client Secret

**Cause**: Extra spaces, line breaks, or invalid characters copied from console

**Fix**:

1. Regenerate the secret in Google/GitHub console
2. Copy **exactly** without extra spaces
3. Paste directly into Supabase field

### Issue: "Redirect URI mismatch"

**Cause**: The redirect URI doesn't match exactly

**Fix**:

1. Ensure the callback URL in Google/GitHub matches:
   ```
   https://hiivmcadmcjjksxpckdw.supabase.co/auth/v1/callback
   ```
2. No trailing slashes
3. Use HTTPS for production

### Issue: "OAuth sign-in failed"

**Possible causes**:

1. Client ID/Secret incorrect
2. OAuth app not published (Google)
3. Redirect URI mismatch
4. Supabase env vars not loaded

**Fix**:

1. Double-check credentials in Supabase dashboard
2. For Google: Publish the OAuth consent screen
3. Verify redirect URIs match exactly
4. Check browser console for detailed error

### Issue: Email/Password sign-in works but OAuth doesn't

**Fix**:

1. Ensure OAuth is enabled in Supabase (toggle ON)
2. Verify credentials are saved (click Save in Supabase)
3. Clear browser cache and try again
4. Check Supabase logs: Dashboard → Logs → Auth logs

---

## 🔍 Debugging Tips

### Check Supabase Auth Logs

1. Go to Supabase Dashboard
2. Navigate to **Logs** → **Auth**
3. Look for errors during OAuth attempts
4. Common error codes:
   - `invalid_request`: Missing/incorrect parameters
   - `invalid_client`: Wrong client ID/secret
   - `redirect_uri_mismatch`: URI doesn't match

### Browser Console Errors

Open browser DevTools (F12) and check Console for:

```
Error: OAuth sign-in failed
Error: Supabase not configured
```

### Network Tab

1. Open DevTools → Network
2. Attempt OAuth sign-in
3. Look for failed requests to:
   - `https://hiivmcadmcjjksxpckdw.supabase.co/auth/v1/authorize`
   - OAuth provider endpoints

---

## 📝 Environment Variables Checklist

Ensure you have these in your `.env` file:

```env
VITE_SUPABASE_URL=https://hiivmcadmcjjksxpckdw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
VITE_HUGGINGFACE_API_KEY=hf_xxxxx
```

⚠️ **Never commit `.env` to Git!**

---

## ✅ Final Checklist

Before going live, ensure:

- [ ] Google OAuth Client ID/Secret configured in Supabase
- [ ] GitHub OAuth Client ID/Secret configured in Supabase
- [ ] Redirect URIs include production domain
- [ ] OAuth consent screen published (Google)
- [ ] Tested OAuth flow in incognito/private browsing
- [ ] Email/password fallback works
- [ ] Error messages display properly
- [ ] Success redirects work correctly

---

## 🆘 Still Having Issues?

1. **Check Supabase Status**: [status.supabase.com](https://status.supabase.com)
2. **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
3. **GitHub Issues**: Check if others have similar problems
4. **Contact Support**: support@supabase.io

---

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Guide](https://support.google.com/cloud/answer/6158849)
- [GitHub OAuth Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [OAuth 2.0 Spec](https://oauth.net/2/)

---

**Last Updated**: November 9, 2025  
**Project**: Resumay Tailor Swift  
**Supabase Project**: hiivmcadmcjjksxpckdw
