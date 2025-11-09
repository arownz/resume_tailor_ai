# 🗄️ Supabase Setup Guide

This guide will help you set up Supabase for user authentication and data persistence.

## Why Supabase?

Supabase provides:
- **Authentication**: User sign-up, login, password reset
- **PostgreSQL Database**: Store analysis history
- **Row Level Security**: Automatic data protection
- **Real-time subscriptions**: Track changes instantly
- **RESTful API**: Automatic API generation

## Is Supabase Required?

**No!** The app works without Supabase. You'll just lose:
- User accounts
- Analysis history
- Subscription management

For a personal portfolio project, you can skip Supabase initially.

## Step-by-Step Setup

### 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign up with GitHub (recommended) or email
4. Verify your email

### 2. Create a New Project

1. Click **New Project**
2. Choose an organization (or create one)
3. Fill in project details:
   - **Name**: `resume-tailor-ai`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect for development
4. Click **Create new project**
5. Wait 2-3 minutes for setup to complete

### 3. Get Your API Credentials

1. Once the project is ready, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGc...very_long_key
```

4. Add to your `.env` file:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...very_long_key
```

### 4. Set Up Database Schema

1. Click on **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (user metadata)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'pro', 'premium')),
  analysis_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analyses table (store all resume analyses)
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume JSONB NOT NULL,
  job_description JSONB NOT NULL,
  tailored_output JSONB NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to increment analysis count
CREATE OR REPLACE FUNCTION increment_analysis_count(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    analysis_count = analysis_count + 1,
    updated_at = NOW()
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_score ON analyses(score);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for analyses table
CREATE POLICY "Users can view own analyses"
  ON analyses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analyses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

4. Click **Run** (or press F5)
5. You should see "Success. No rows returned"

### 5. Configure Authentication

1. Go to **Authentication** in the left sidebar
2. Click **Providers**
3. Enable the providers you want:
   - **Email**: Already enabled by default
   - **Google**: Optional (requires OAuth setup)
   - **GitHub**: Optional (requires OAuth app)

For now, Email authentication is sufficient.

### 6. Set Up Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - **Confirm signup**: Welcome email
   - **Reset password**: Password reset link
   - **Magic Link**: Passwordless login

### 7. Verify Installation

Start your app:

```bash
npm run dev
```

Check the browser console. You should NOT see:
```
Supabase credentials not configured
```

## Testing the Database

### Create a Test User

You can create a test user via the Supabase dashboard:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Choose **Create new user**
4. Enter email and password
5. Click **Create user**

### View Data

1. Go to **Table Editor**
2. Select `profiles` table
3. You should see your test user's profile
4. Run an analysis in your app
5. Check the `analyses` table - you should see your analysis stored

## Database Queries

### View All Analyses for a User

```sql
SELECT * FROM analyses 
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC;
```

### Get Analysis Statistics

```sql
SELECT 
  user_id,
  COUNT(*) as total_analyses,
  AVG(score) as average_score,
  MAX(score) as best_score
FROM analyses
GROUP BY user_id;
```

### Clean Up Old Data

```sql
-- Delete analyses older than 90 days
DELETE FROM analyses 
WHERE created_at < NOW() - INTERVAL '90 days';
```

## Troubleshooting

### "relation does not exist"
- Make sure you ran the SQL schema
- Check you're in the correct project

### "new row violates row-level security policy"
- User is not authenticated
- Check `auth.uid()` returns a valid user ID
- Verify RLS policies are correct

### "User not found"
- Clear browser storage
- Re-authenticate
- Check Supabase project URL is correct

### Slow Queries
- Add indexes to frequently queried columns
- Use `EXPLAIN ANALYZE` to identify bottlenecks

## Security Best Practices

### 1. Never Expose Service Role Key
The `service_role` key bypasses RLS. Only use it in server-side code, NEVER in frontend!

### 2. Use Environment Variables
Don't commit `.env` file to Git:
```bash
echo ".env" >> .gitignore
```

### 3. Enable Email Verification
In Supabase dashboard:
1. Go to **Authentication** → **Settings**
2. Enable **Enable email confirmations**

### 4. Set Up Rate Limiting
Prevent abuse by limiting requests:
```sql
-- Example: Limit analyses to 10 per hour per user
CREATE OR REPLACE FUNCTION check_analysis_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*) FROM analyses 
    WHERE user_id = NEW.user_id 
    AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please try again later.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_analysis_rate_limit
  BEFORE INSERT ON analyses
  FOR EACH ROW EXECUTE FUNCTION check_analysis_rate_limit();
```

## Monitoring & Analytics

### View Usage Statistics

Go to **Reports** in Supabase dashboard to see:
- API requests per day
- Database size
- Authentication events
- Error logs

### Set Up Alerts

1. Go to **Settings** → **Billing**
2. Enable usage alerts
3. Set thresholds (e.g., 80% of free tier limit)

## Free Tier Limits

Supabase free tier includes:
- ✅ 500 MB database space
- ✅ 2 GB file storage
- ✅ 50,000 monthly active users
- ✅ 500 MB bandwidth/month
- ✅ Social OAuth providers

Perfect for development and small projects!

## Upgrade Options

When you need more:
- **Pro**: $25/month - 8 GB database, 100 GB bandwidth
- **Team**: Custom pricing - Priority support
- **Enterprise**: Custom - SLAs, dedicated support

## Alternative: Skip Supabase

If you don't want to set up Supabase:

1. Comment out Supabase imports in your code
2. Use browser localStorage for temporary storage:

```typescript
// Save analysis to localStorage
localStorage.setItem('lastAnalysis', JSON.stringify(results));

// Retrieve later
const saved = JSON.parse(localStorage.getItem('lastAnalysis') || '{}');
```

3. Add a note in your README that it's a client-only demo

## Next Steps

1. ✅ Create Supabase account
2. ✅ Set up project and database
3. ✅ Add credentials to `.env`
4. 🔐 (Optional) Add user authentication UI
5. 📊 (Optional) Create analytics dashboard
6. 🚀 Deploy your app!

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Functions Reference](https://www.postgresql.org/docs/current/functions.html)
- [Supabase Discord](https://discord.supabase.com/)

---

**Need help?** Open an issue or ask in the Supabase Discord!
