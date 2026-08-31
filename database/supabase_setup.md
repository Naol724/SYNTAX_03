# Supabase Setup Guide

## SYNTAX Website - Supabase Configuration

This guide will help you set up your PostgreSQL database on Supabase for the SYNTAX website project.

---

## Prerequisites

1. **Supabase Account**
   - Sign up at [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project credentials

2. **Database Information**
   - Project URL
   - Project API Key (anon/public)
   - Project API Key (service_role - keep secret!)
   - Database Password

---

## Step 1: Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the details:
   - **Name:** `syntax-website`
   - **Database Password:** (Strong password - save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier for development
4. Wait for project to be created (2-3 minutes)

---

## Step 2: Run Database Migration

### Option A: Using Supabase SQL Editor (Recommended)

1. Navigate to your project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `database/migrations/001_initial_schema.sql`
5. Click **Run** or press `Ctrl+Enter`
6. Wait for completion (should see "Success. No rows returned")

### Option B: Using Local psql Client

```bash
# Get your connection string from Supabase Dashboard
# Settings > Database > Connection string > URI

psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" \
  -f database/migrations/001_initial_schema.sql
```

### Option C: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref [YOUR-PROJECT-REF]

# Run migration
supabase db push
```

---

## Step 3: Verify Database Setup

Run these queries in SQL Editor to verify:

```sql
-- Check all tables are created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should return 11 tables:
-- admins, users, services, portfolio, blog, testimonials,
-- developers, messages, ai_chat_assistant, refresh_tokens, analytics_events

-- Check all views are created
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';

-- Should return 4 views:
-- vw_published_portfolio, vw_published_blogs, 
-- vw_active_services, vw_message_stats

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Should return 30+ indexes
```

---

## Step 4: Configure Row Level Security (RLS)

Supabase uses Row Level Security for access control. Add these policies:

```sql
-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_assistant ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can view published portfolio"
  ON portfolio FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view published blogs"
  ON blog FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Public can view active developers"
  ON developers FOR SELECT
  USING (is_active = true);

-- Users can create messages
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Users can view their own messages
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (sender_email = auth.jwt()->>'email' OR user_id::text = auth.uid()::text);

-- Users can create AI chat sessions
CREATE POLICY "Users can create AI chats"
  ON ai_chat_assistant FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text OR user_id IS NULL);

-- Users can view their own AI chat history
CREATE POLICY "Users can view own AI chats"
  ON ai_chat_assistant FOR SELECT
  USING (user_id::text = auth.uid()::text OR user_id IS NULL);

-- Admin full access (requires auth.role() = 'admin')
-- Note: This requires custom JWT claims or service role key
CREATE POLICY "Admins have full access to all tables"
  ON admins FOR ALL
  USING (auth.jwt()->>'role' = 'admin');

-- Similar policies for other admin operations...
```

---

## Step 5: Create Storage Buckets

For image uploads (portfolio, blog, testimonials):

1. Go to **Storage** in Supabase dashboard
2. Create these buckets:

### Portfolio Images
```sql
-- Bucket: portfolio-images
-- Public: Yes
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp
```

### Blog Images
```sql
-- Bucket: blog-images
-- Public: Yes
-- File size limit: 3MB
-- Allowed MIME types: image/jpeg, image/png, image/webp
```

### Developer Avatars
```sql
-- Bucket: developer-avatars
-- Public: Yes
-- File size limit: 2MB
-- Allowed MIME types: image/jpeg, image/png
```

### Testimonial Avatars
```sql
-- Bucket: testimonial-avatars
-- Public: Yes
-- File size limit: 1MB
-- Allowed MIME types: image/jpeg, image/png
```

### Storage Policies
```sql
-- Allow public read access
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('portfolio-images', 'blog-images', 'developer-avatars', 'testimonial-avatars'));

-- Allow authenticated uploads
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('portfolio-images', 'blog-images', 'developer-avatars', 'testimonial-avatars')
    AND auth.role() = 'authenticated'
  );

-- Allow admins to delete
CREATE POLICY "Admins can delete files"
  ON storage.objects FOR DELETE
  USING (auth.jwt()->>'role' = 'admin');
```

---

## Step 6: Set Up Database Functions

Add these utility functions:

```sql
-- Function to generate blog slug
CREATE OR REPLACE FUNCTION generate_blog_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(
  content_type TEXT,
  content_id UUID
) RETURNS VOID AS $$
BEGIN
  IF content_type = 'blog' THEN
    UPDATE blog SET views_count = views_count + 1 WHERE blog_id = content_id;
  ELSIF content_type = 'portfolio' THEN
    UPDATE portfolio SET views_count = views_count + 1 WHERE portfolio_id = content_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent activity
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  activity_type TEXT,
  activity_id UUID,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  (
    SELECT 'blog' AS activity_type, blog_id AS activity_id, title, created_at
    FROM blog WHERE is_published = true
    ORDER BY created_at DESC LIMIT limit_count
  )
  UNION ALL
  (
    SELECT 'portfolio' AS activity_type, portfolio_id AS activity_id, project_name AS title, created_at
    FROM portfolio WHERE is_published = true
    ORDER BY created_at DESC LIMIT limit_count
  )
  UNION ALL
  (
    SELECT 'message' AS activity_type, message_id AS activity_id, subject AS title, created_at
    FROM messages
    ORDER BY created_at DESC LIMIT limit_count
  )
  ORDER BY created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

---

## Step 7: Create Database Backup Schedule

1. Go to **Database** > **Backups** in Supabase dashboard
2. Configure automatic backups:
   - **Frequency:** Daily
   - **Retention:** 7 days (Free tier) or 30 days (Pro)
   - **Time:** Off-peak hours (e.g., 2:00 AM)

---

## Step 8: Configure Environment Variables

Create `.env.local` in your Next.js project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Database Connection (for backend)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=[GENERATE-RANDOM-SECRET]
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Admin Credentials (Initial Setup)
ADMIN_EMAIL=admin@syntax.com
ADMIN_PASSWORD=[STRONG-PASSWORD]

# Grok API Configuration
GROK_API_KEY=[YOUR-GROK-API-KEY]
GROK_API_URL=https://api.x.ai/v1

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=[YOUR-EMAIL]
SMTP_PASSWORD=[YOUR-APP-PASSWORD]

# Environment
NODE_ENV=development
```

---

## Step 9: Seed Initial Data (Optional)

Run this to create initial admin user:

```sql
-- Create initial admin (CHANGE PASSWORD!)
INSERT INTO admins (username, email, password_hash, full_name, role)
VALUES (
  'admin',
  'admin@syntax.com',
  '$2b$10$rKfF7qOqD7RJ8kCfXJP5B.3yL4YxW8cN5dKzN1G7qG8L0fH8K9Wm6', -- "Admin@123"
  'System Administrator',
  'super_admin'
);

-- Create sample services
INSERT INTO services (name, type, language, description, short_description, is_active, display_order, admin_id)
SELECT 
  'Web Development',
  'web-development',
  ARRAY['React', 'Next.js', 'TypeScript'],
  'Full-stack web development services using modern technologies',
  'Modern web applications',
  true,
  1,
  admin_id
FROM admins LIMIT 1;

INSERT INTO services (name, type, language, description, short_description, is_active, display_order, admin_id)
SELECT 
  'Mobile App Development',
  'mobile-app',
  ARRAY['React Native', 'Flutter'],
  'Cross-platform mobile application development',
  'iOS & Android apps',
  true,
  2,
  admin_id
FROM admins LIMIT 1;

-- Create sample developer
INSERT INTO developers (full_name, skill, position, bio, is_active, display_order, admin_id)
SELECT 
  'John Doe',
  ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
  'Senior Full Stack Developer',
  'Experienced full-stack developer with 5+ years in modern web technologies',
  true,
  1,
  admin_id
FROM admins LIMIT 1;
```

---

## Step 10: Monitor Database Performance

### Enable pg_stat_statements
```sql
-- Enable query statistics
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- View slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Set Up Alerts
1. Go to **Database** > **Monitoring**
2. Configure alerts for:
   - High CPU usage (>80%)
   - High memory usage (>80%)
   - Slow queries (>1000ms)
   - Connection pool exhaustion

---

## Security Best Practices

### 1. API Keys
- ❌ Never commit `service_role` key to Git
- ✅ Use `anon` key for client-side operations
- ✅ Use `service_role` key only in backend/server-side code
- ✅ Store keys in environment variables

### 2. RLS Policies
- ✅ Always enable RLS on all tables
- ✅ Test policies with different user roles
- ✅ Use `auth.uid()` for user-specific data
- ✅ Restrict admin operations to authenticated admins

### 3. Password Security
- ✅ Use bcrypt with minimum 10 rounds
- ✅ Enforce strong password requirements
- ✅ Implement password reset functionality
- ✅ Use JWT for session management

### 4. Database Access
- ❌ Never expose database credentials to frontend
- ✅ Use connection pooling (PgBouncer)
- ✅ Implement rate limiting on API endpoints
- ✅ Use prepared statements to prevent SQL injection

---

## Troubleshooting

### Connection Issues
```bash
# Test connection
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" -c "SELECT version();"
```

### Migration Failures
```bash
# Rollback if needed
psql "postgresql://..." -f database/migrations/002_rollback.sql

# Re-run migration
psql "postgresql://..." -f database/migrations/001_initial_schema.sql
```

### Performance Issues
```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check missing indexes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;
```

---

## Next Steps

1. ✅ Database schema created
2. ✅ RLS policies configured
3. ✅ Storage buckets set up
4. ✅ Environment variables configured
5. ⏭️ **Continue to PHASE 2: Backend Architecture**

---

**Support Resources:**
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Discord](https://discord.supabase.com)

**Version:** 1.0.0  
**Last Updated:** 2026-08-23
