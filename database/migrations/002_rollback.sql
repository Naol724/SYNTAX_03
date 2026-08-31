-- =====================================================
-- ROLLBACK MIGRATION - 001_initial_schema.sql
-- Use this to revert the initial schema
-- WARNING: This will delete all data!
-- =====================================================

-- Drop views first
DROP VIEW IF EXISTS vw_message_stats CASCADE;
DROP VIEW IF EXISTS vw_active_services CASCADE;
DROP VIEW IF EXISTS vw_published_blogs CASCADE;
DROP VIEW IF EXISTS vw_published_portfolio CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
DROP TRIGGER IF EXISTS update_developers_updated_at ON developers;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
DROP TRIGGER IF EXISTS update_blog_updated_at ON blog;
DROP TRIGGER IF EXISTS update_portfolio_updated_at ON portfolio;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS ai_chat_assistant CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS developers CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS blog CASCADE;
DROP TABLE IF EXISTS portfolio CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Drop extensions
DROP EXTENSION IF EXISTS "btree_gist";
DROP EXTENSION IF EXISTS "uuid-ossp";

-- =====================================================
-- END OF ROLLBACK
-- =====================================================
