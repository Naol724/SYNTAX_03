# Database Documentation

## SYNTAX Website - PostgreSQL Database

This directory contains all database-related files for the SYNTAX website project.

---

## 📁 Directory Structure

```
database/
├── migrations/
│   ├── 001_initial_schema.sql      # Initial database schema
│   └── 002_rollback.sql            # Rollback script
├── ER_DIAGRAM.md                   # Entity-Relationship documentation
├── supabase_setup.md               # Supabase configuration guide
└── README.md                       # This file
```

---

## 🗄️ Database Overview

- **Database Type:** PostgreSQL 14+
- **Hosting:** Supabase (Production) / Local (Development)
- **Total Tables:** 11 core tables
- **Total Views:** 4 materialized views
- **Total Indexes:** 30+ optimized indexes

---

## 📊 Core Tables

| Table | Purpose | Key Features |
|-------|---------|--------------|
| **admins** | Admin authentication | JWT auth, role-based access |
| **users** | Registered users | Client management |
| **services** | Company services | Array columns, JSONB properties |
| **portfolio** | Project showcase | Image support, featured projects |
| **blog** | Blog posts | SEO optimization, full-text search |
| **testimonials** | Client reviews | Rating system, approval workflow |
| **developers** | Team profiles | Skills array, social links |
| **messages** | User inquiries | Priority system, status tracking |
| **ai_chat_assistant** | AI conversations | Session-based, context preservation |
| **refresh_tokens** | JWT tokens | Token revocation, security tracking |
| **analytics_events** | Website analytics | Event tracking, user behavior |

---

## 🚀 Quick Start

### Option 1: Supabase (Recommended for Production)

1. Follow the complete guide in [`supabase_setup.md`](./supabase_setup.md)
2. Create a Supabase project
3. Run the migration in SQL Editor
4. Configure RLS policies
5. Set up storage buckets

### Option 2: Local PostgreSQL

```bash
# Install PostgreSQL (if not already installed)
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Start PostgreSQL service
# Windows: Check Services app
# Mac/Linux: sudo service postgresql start

# Create database
psql -U postgres -c "CREATE DATABASE syntax_db;"

# Run migration
psql -U postgres -d syntax_db -f migrations/001_initial_schema.sql

# Verify setup
psql -U postgres -d syntax_db -c "\dt"
```

---

## 📝 Migration Files

### `001_initial_schema.sql`
Complete database schema including:
- ✅ All 11 tables with proper constraints
- ✅ UUID extensions
- ✅ Timestamp triggers
- ✅ Indexes for performance
- ✅ Views for common queries
- ✅ Comments and documentation

### `002_rollback.sql`
Safely rollback the initial schema:
- ⚠️ **WARNING:** Deletes all data
- Use only for development/testing
- Drops all tables, views, triggers, and functions

---

## 🔐 Security Features

### 1. **Authentication**
- Password hashing with bcrypt (10+ rounds)
- JWT token-based authentication
- Refresh token rotation
- Session management

### 2. **Authorization**
- Row Level Security (RLS) policies
- Role-based access control (RBAC)
- User-specific data isolation
- Public/private content separation

### 3. **Data Protection**
- Email format validation
- Input constraints
- SQL injection prevention (parameterized queries)
- Sensitive data encryption

### 4. **Audit Trail**
- Created/updated timestamps on all records
- Admin action tracking
- User activity logging
- Analytics event recording

---

## 🎯 Database Relationships

### Key Relationships
```
ADMINS
  ├── services (1:many)
  ├── portfolio (1:many)
  ├── blog (1:many)
  ├── testimonials (1:many)
  ├── developers (1:many)
  └── refresh_tokens (1:many)

USERS
  ├── messages (1:many)
  ├── ai_chat_assistant (1:many)
  └── analytics_events (1:many)

PORTFOLIO
  └── testimonials (1:many)
```

For detailed ER diagram, see [`ER_DIAGRAM.md`](./ER_DIAGRAM.md)

---

## 🔍 Database Features

### Array Columns
Efficient multi-value storage without junction tables:
- `services.language[]` - Programming languages
- `portfolio.language_used[]` - Technologies used
- `developers.skill[]` - Developer skills
- `blog.tags[]` - Blog post tags

### JSONB Columns
Flexible schema for dynamic data:
- `services.property` - Service properties (pricing, duration)
- `developers.social_media_links` - Social profiles
- `ai_chat_assistant.context` - Conversation context
- `analytics_events.metadata` - Event data

### Full-Text Search
Optimized text search for blog content:
```sql
SELECT * FROM blog 
WHERE to_tsvector('english', title || ' ' || content) 
@@ to_tsquery('search terms');
```

### Materialized Views
Pre-computed views for common queries:
- `vw_published_portfolio` - Published projects with ratings
- `vw_published_blogs` - Published blog posts
- `vw_active_services` - Active services
- `vw_message_stats` - Message statistics for dashboard

---

## 📈 Performance Optimization

### Indexes
- **24 B-tree indexes** for standard lookups
- **7 GIN indexes** for array and full-text search
- **11 partial indexes** for filtered queries

### Most Critical Indexes
```sql
-- Authentication
CREATE INDEX idx_admins_email ON admins(email);

-- SEO URLs
CREATE INDEX idx_blog_slug ON blog(slug);

-- Admin dashboard
CREATE INDEX idx_messages_status ON messages(status);

-- Public queries
CREATE INDEX idx_portfolio_published ON portfolio(is_published);

-- Full-text search
CREATE INDEX idx_blog_search ON blog USING GIN(to_tsvector('english', title || ' ' || content));
```

### Query Optimization Tips
1. Use prepared statements
2. Leverage indexes for WHERE clauses
3. Use LIMIT for pagination
4. Cache materialized view results
5. Monitor slow queries with `pg_stat_statements`

---

## 🧪 Testing Database

### Seed Test Data
```sql
-- Create test admin
INSERT INTO admins (username, email, password_hash, full_name, role)
VALUES ('testadmin', 'test@syntax.com', '$2b$10$...', 'Test Admin', 'admin');

-- Create test services
INSERT INTO services (name, type, language, description, is_active, display_order, admin_id)
SELECT 'Test Service', 'web-development', ARRAY['React', 'Node.js'], 
       'Test description', true, 1, admin_id
FROM admins WHERE email = 'test@syntax.com';
```

### Run Test Queries
```sql
-- Test all views
SELECT * FROM vw_published_portfolio LIMIT 5;
SELECT * FROM vw_published_blogs LIMIT 5;
SELECT * FROM vw_active_services;
SELECT * FROM vw_message_stats;

-- Test full-text search
SELECT title FROM blog 
WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('typescript')
AND is_published = true;

-- Test array search
SELECT name FROM services 
WHERE 'React' = ANY(language)
AND is_active = true;
```

---

## 🛠️ Maintenance

### Daily Tasks
- Monitor database size
- Check slow queries
- Review error logs
- Verify backups

### Weekly Tasks
- Analyze query performance
- Update statistics (`ANALYZE`)
- Review index usage
- Clean up old analytics data

### Monthly Tasks
- Vacuum database (`VACUUM ANALYZE`)
- Review and optimize indexes
- Archive old data
- Update documentation

### Maintenance Queries
```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('syntax_db'));

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Vacuum and analyze
VACUUM ANALYZE;

-- Update statistics
ANALYZE;
```

---

## 📦 Backup & Recovery

### Automated Backups (Supabase)
- Configured in Supabase dashboard
- Daily backups at 2:00 AM
- 7-day retention (Free tier)
- 30-day retention (Pro tier)

### Manual Backup
```bash
# Full backup
pg_dump -U postgres -d syntax_db -F c -f backup_$(date +%Y%m%d).dump

# Schema only
pg_dump -U postgres -d syntax_db -s -f schema_$(date +%Y%m%d).sql

# Data only
pg_dump -U postgres -d syntax_db -a -f data_$(date +%Y%m%d).sql
```

### Restore from Backup
```bash
# Restore full backup
pg_restore -U postgres -d syntax_db -c backup_20260823.dump

# Restore schema
psql -U postgres -d syntax_db -f schema_20260823.sql

# Restore data
psql -U postgres -d syntax_db -f data_20260823.sql
```

---

## 🔧 Troubleshooting

### Common Issues

#### Connection Refused
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Check connection string
psql "postgresql://user:pass@host:port/db" -c "SELECT 1;"
```

#### Migration Fails
```bash
# Check for syntax errors
psql -U postgres -d syntax_db < migrations/001_initial_schema.sql

# Rollback and retry
psql -U postgres -d syntax_db < migrations/002_rollback.sql
psql -U postgres -d syntax_db < migrations/001_initial_schema.sql
```

#### Slow Queries
```sql
-- Enable query logging
ALTER DATABASE syntax_db SET log_min_duration_statement = 1000;

-- View slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

#### Out of Memory
```sql
-- Check memory usage
SELECT 
  pg_size_pretty(sum(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))::bigint) 
FROM pg_tables
WHERE schemaname = 'public';

-- Clear old analytics data
DELETE FROM analytics_events WHERE created_at < NOW() - INTERVAL '90 days';
```

---

## 📚 Additional Resources

### Documentation
- [ER_DIAGRAM.md](./ER_DIAGRAM.md) - Complete database schema documentation
- [supabase_setup.md](./supabase_setup.md) - Supabase configuration guide
- [PostgreSQL Docs](https://www.postgresql.org/docs/) - Official PostgreSQL documentation

### Tools
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL GUI tool
- [DBeaver](https://dbeaver.io/) - Universal database tool
- [Postico](https://eggerapps.at/postico/) - PostgreSQL client for Mac

### Monitoring
- [pg_stat_statements](https://www.postgresql.org/docs/current/pgstatstatements.html) - Query statistics
- [pgBadger](https://github.com/darold/pgbadger) - Log analyzer
- Supabase Dashboard - Built-in monitoring

---

## ✅ Database Setup Checklist

- [ ] PostgreSQL 14+ installed
- [ ] Database created (`syntax_db`)
- [ ] Initial migration run successfully
- [ ] All 11 tables created
- [ ] All 4 views created
- [ ] All 30+ indexes created
- [ ] Triggers set up for timestamps
- [ ] RLS policies configured (Supabase)
- [ ] Storage buckets created (Supabase)
- [ ] Environment variables configured
- [ ] Initial admin user created
- [ ] Backups configured
- [ ] Monitoring enabled

---

## 🎉 Phase 1 Complete!

Your database is now ready. Next steps:

1. ✅ **Database Design** - COMPLETED
2. ⏭️ **Backend Architecture** - Continue to PHASE 2
3. ⏭️ **JWT Authentication** - Continue to PHASE 3

---

**Version:** 1.0.0  
**Author:** Senior Full Stack Engineer  
**Last Updated:** 2026-08-23

---

## 📧 Support

For questions or issues:
1. Check the troubleshooting section
2. Review the ER diagram documentation
3. Consult the Supabase setup guide
4. Open an issue in the project repository
