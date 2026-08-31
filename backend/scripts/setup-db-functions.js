/**
 * Creates required PostgreSQL functions in Supabase.
 * Run: node scripts/setup-db-functions.js
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const functions = `
-- Recent activity function for dashboard
CREATE OR REPLACE FUNCTION get_recent_activity(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  activity_type TEXT,
  activity_id UUID,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 'blog'::TEXT, b.blog_id, b.title, b.created_at
  FROM blog b WHERE b.is_published = true
  UNION ALL
  SELECT 'portfolio'::TEXT, p.portfolio_id, p.project_name, p.created_at
  FROM portfolio p WHERE p.is_published = true
  UNION ALL
  SELECT 'message'::TEXT, m.message_id, m.subject, m.created_at
  FROM messages m
  ORDER BY created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Blog slug generator
CREATE OR REPLACE FUNCTION generate_blog_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Increment view count
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
`;

async function run() {
  try {
    await pool.query(functions);
    console.log('✅ Database functions created successfully');
    console.log('   - get_recent_activity()');
    console.log('   - generate_blog_slug()');
    console.log('   - increment_view_count()');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

run();
