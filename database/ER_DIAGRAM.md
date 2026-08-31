# Database Entity-Relationship Diagram

## SYNTAX Website - Database Schema Documentation

### Database Overview
- **Database Type:** PostgreSQL 14+
- **Schema Version:** 1.0.0
- **Total Tables:** 11 core tables
- **Total Views:** 4 materialized views
- **Relationships:** 15 foreign key relationships

---

## Entity Relationship Diagram (Textual Representation)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SYNTAX WEBSITE DATABASE                       │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   ADMINS     │          │    USERS     │          │  MESSAGES    │
├──────────────┤          ├──────────────┤          ├──────────────┤
│ admin_id PK  │──┐       │ user_id PK   │──┐       │ message_id PK│
│ username     │  │       │ email        │  │       │ user_id FK   │───┐
│ email        │  │       │ full_name    │  │       │ sender_name  │   │
│ password_hash│  │       │ phone_number │  │       │ sender_email │   │
│ full_name    │  │       │ company_name │  │       │ subject      │   │
│ role         │  │       │ is_active    │  │       │ message      │   │
│ is_active    │  │       │ created_at   │  │       │ status       │   │
│ last_login   │  │       │ updated_at   │  │       │ priority     │   │
│ created_at   │  │       └──────────────┘  │       │ responded_by │   │
│ updated_at   │  │                          │       │ created_at   │   │
└──────────────┘  │                          │       └──────────────┘   │
       │          │                          │              │           │
       │          │                          │              └───────────┘
       │          │                          │
       ├──────────┼──────────────────────────┼────────────────┐
       │          │                          │                │
       │          │                          │                │
       ▼          │                          ▼                ▼
┌──────────────┐  │                   ┌──────────────────────────┐
│   SERVICES   │  │                   │   AI_CHAT_ASSISTANT     │
├──────────────┤  │                   ├──────────────────────────┤
│ service_id PK│  │                   │ chat_id PK              │
│ admin_id FK  │──┘                   │ user_id FK              │
│ name         │                      │ session_id              │
│ type         │                      │ user_message            │
│ property     │                      │ ai_response             │
│ language[]   │                      │ context JSONB           │
│ description  │                      │ response_time_ms        │
│ is_active    │                      │ tokens_used             │
│ display_order│                      │ was_helpful             │
│ created_at   │                      │ created_at              │
│ updated_at   │                      └──────────────────────────┘
└──────────────┘
       │
       │
       ▼
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  PORTFOLIO   │          │TESTIMONIALS  │          │  DEVELOPERS  │
├──────────────┤          ├──────────────┤          ├──────────────┤
│portfolio_id  │──┐       │testimonial_id│          │developer_id  │
│ admin_id FK  │  │       │ portfolio_id │◄─────────│ admin_id FK  │
│ project_name │  │       │ admin_id FK  │          │ full_name    │
│ portfolio_typ│  │       │ client_name  │          │ skill[]      │
│ language[]   │  │       │ project_type │          │ position     │
│ project_link │  │       │ position_work│          │ bio          │
│ image_url    │  │       │ location     │          │ email        │
│ description  │  │       │ feedback     │          │ phone_number │
│ is_featured  │  │       │ rating       │          │ social_media │
│ is_published │  │       │ is_featured  │          │ is_active    │
│ views_count  │  │       │ is_approved  │          │ display_order│
│ created_at   │  │       │ created_at   │          │ created_at   │
│ updated_at   │  │       │ updated_at   │          │ updated_at   │
└──────────────┘  │       └──────────────┘          └──────────────┘
       │          │
       └──────────┘
       
       │
       │
       ▼
┌──────────────┐          ┌──────────────────────┐
│     BLOG     │          │  REFRESH_TOKENS      │
├──────────────┤          ├──────────────────────┤
│ blog_id PK   │          │ token_id PK          │
│ admin_id FK  │──────────│ admin_id FK          │
│ title        │          │ token_hash           │
│ slug         │          │ expires_at           │
│ content      │          │ is_revoked           │
│ category     │          │ user_agent           │
│ tags[]       │          │ ip_address           │
│ publish_date │          │ created_at           │
│ is_published │          └──────────────────────┘
│ is_featured  │
│ views_count  │          ┌──────────────────────┐
│ seo_title    │          │  ANALYTICS_EVENTS    │
│ seo_keywords │          ├──────────────────────┤
│ created_at   │          │ event_id PK          │
│ updated_at   │          │ user_id FK           │
└──────────────┘          │ event_type           │
                          │ session_id           │
                          │ page_url             │
                          │ device_type          │
                          │ metadata JSONB       │
                          │ created_at           │
                          └──────────────────────┘
```

---

## Table Relationships

### 1. **ADMINS** (Central Authentication Entity)
- **Primary Key:** `admin_id` (UUID)
- **Relationships:**
  - One-to-Many → `services` (admin manages services)
  - One-to-Many → `portfolio` (admin manages portfolio)
  - One-to-Many → `blog` (admin creates blog posts)
  - One-to-Many → `testimonials` (admin manages testimonials)
  - One-to-Many → `developers` (admin manages team profiles)
  - One-to-Many → `messages` (admin responds to messages)
  - One-to-Many → `refresh_tokens` (admin authentication tokens)

### 2. **USERS** (Client/Visitor Entity)
- **Primary Key:** `user_id` (UUID)
- **Relationships:**
  - One-to-Many → `messages` (user sends messages)
  - One-to-Many → `ai_chat_assistant` (user interacts with AI)
  - One-to-Many → `analytics_events` (user activity tracking)

### 3. **SERVICES**
- **Primary Key:** `service_id` (UUID)
- **Foreign Keys:**
  - `admin_id` → `admins.admin_id` (ON DELETE SET NULL)
- **Features:**
  - Array type for languages: `language VARCHAR(50)[]`
  - JSONB for flexible properties

### 4. **PORTFOLIO**
- **Primary Key:** `portfolio_id` (UUID)
- **Foreign Keys:**
  - `admin_id` → `admins.admin_id` (ON DELETE SET NULL)
- **Relationships:**
  - One-to-Many → `testimonials` (projects receive testimonials)
- **Features:**
  - Array type for languages: `language_used VARCHAR(50)[]`
  - Featured projects support
  - View counter

### 5. **BLOG**
- **Primary Key:** `blog_id` (UUID)
- **Foreign Keys:**
  - `admin_id` → `admins.admin_id` (ON DELETE SET NULL)
- **Features:**
  - SEO optimization fields
  - Full-text search index
  - Tag support (array type)
  - Slug for SEO-friendly URLs

### 6. **TESTIMONIALS**
- **Primary Key:** `testimonial_id` (UUID)
- **Foreign Keys:**
  - `portfolio_id` → `portfolio.portfolio_id` (ON DELETE SET NULL)
  - `admin_id` → `admins.admin_id` (ON DELETE SET NULL)
- **Features:**
  - Rating system (0-5 stars)
  - Approval workflow
  - Featured testimonials

### 7. **DEVELOPERS**
- **Primary Key:** `developer_id` (UUID)
- **Foreign Keys:**
  - `admin_id` → `admins.admin_id` (ON DELETE SET NULL)
- **Features:**
  - Skills array: `skill VARCHAR(50)[]`
  - Social media links (JSONB)
  - Display order support

### 8. **MESSAGES**
- **Primary Key:** `message_id` (UUID)
- **Foreign Keys:**
  - `user_id` → `users.user_id` (ON DELETE SET NULL)
  - `responded_by` → `admins.admin_id` (ON DELETE SET NULL)
- **Features:**
  - Priority system (low, normal, high, urgent)
  - Status workflow (unread, read, archived, responded)
  - Admin notes support

### 9. **AI_CHAT_ASSISTANT**
- **Primary Key:** `chat_id` (UUID)
- **Foreign Keys:**
  - `user_id` → `users.user_id` (ON DELETE CASCADE)
- **Features:**
  - Session-based conversations
  - Context preservation (JSONB)
  - Performance metrics (response time, tokens)
  - Feedback system

### 10. **REFRESH_TOKENS**
- **Primary Key:** `token_id` (UUID)
- **Foreign Keys:**
  - `admin_id` → `admins.admin_id` (ON DELETE CASCADE)
- **Features:**
  - Token revocation support
  - Security tracking (IP, user agent)
  - Expiration management

### 11. **ANALYTICS_EVENTS**
- **Primary Key:** `event_id` (UUID)
- **Foreign Keys:**
  - `user_id` → `users.user_id` (ON DELETE SET NULL)
- **Features:**
  - Flexible metadata (JSONB)
  - Device and browser tracking
  - Geographic information

---

## Key Database Features

### 1. **UUID Primary Keys**
- All tables use UUID v4 for primary keys
- Better security and scalability
- No sequential ID exposure

### 2. **Timestamp Management**
- `created_at`: Automatically set on record creation
- `updated_at`: Automatically updated via trigger
- Timezone-aware timestamps (TIMESTAMP WITH TIME ZONE)

### 3. **Array Columns**
- Languages: `VARCHAR(50)[]`
- Tags: `VARCHAR(50)[]`
- Skills: `VARCHAR(50)[]`
- Enables multi-value storage without junction tables

### 4. **JSONB Columns**
- Flexible property storage
- Social media links
- Analytics metadata
- Context preservation

### 5. **Full-Text Search**
- Blog content indexed for fast text search
- GIN indexes for tag and array searches

### 6. **Cascading Rules**
- **ON DELETE SET NULL:** Preserve records when parent is deleted
- **ON DELETE CASCADE:** Remove dependent records (refresh tokens, AI chats)

### 7. **Check Constraints**
- Email format validation
- Rating range (0-5)
- Enum-like constraints for status fields

### 8. **Indexes**
- Performance optimization for common queries
- Partial indexes for active/published records
- Composite indexes for frequent join patterns

---

## Materialized Views

### 1. **vw_published_portfolio**
- Shows only published portfolio items
- Includes testimonial count and average rating
- Updated automatically via triggers

### 2. **vw_published_blogs**
- Lists published blog posts
- Optimized for public display
- Includes SEO metadata

### 3. **vw_active_services**
- Shows active services only
- Ordered by display_order
- Lightweight for homepage queries

### 4. **vw_message_stats**
- Real-time message statistics
- Useful for admin dashboard
- Counts by status and priority

---

## Indexes Summary

### Performance Optimization
- **24 B-tree indexes** for standard lookups
- **7 GIN indexes** for array and full-text search
- **11 partial indexes** for filtered queries (active, published, etc.)

### Most Critical Indexes
1. `idx_admins_email` - Authentication
2. `idx_blog_slug` - SEO URLs
3. `idx_messages_status` - Admin dashboard
4. `idx_portfolio_published` - Public queries
5. `idx_blog_search` - Full-text search

---

## Security Considerations

### 1. **Password Storage**
- Passwords hashed with bcrypt
- Never store plain text passwords
- Minimum 10 rounds for bcrypt

### 2. **Token Management**
- Refresh tokens stored as hashes
- Expiration enforcement
- Revocation support

### 3. **Input Validation**
- Email format constraints
- Rating range validation
- Enum-like type checking

### 4. **Soft Deletes**
- Use `is_active` flags instead of hard deletes
- Preserve data integrity
- Enable audit trails

---

## Scalability Features

### 1. **Partitioning Ready**
- Timestamp columns enable time-based partitioning
- Analytics table is partition candidate
- Blog archive partitioning possible

### 2. **Read Replicas**
- Views optimize read queries
- Separate read/write workloads
- Cache materialized view data

### 3. **Connection Pooling**
- Use PgBouncer for connection management
- Optimize for high concurrency
- Reduce connection overhead

---

## Migration Strategy

### Initial Setup
```bash
# Run initial schema
psql -U postgres -d syntax_db -f 001_initial_schema.sql

# Verify tables
psql -U postgres -d syntax_db -c "\dt"

# Verify indexes
psql -U postgres -d syntax_db -c "\di"
```

### Future Migrations
- Use numbered migration files (002_, 003_, etc.)
- Always include rollback scripts
- Test on staging before production

---

## Backup Strategy

### Daily Backups
```bash
pg_dump -U postgres -d syntax_db -F c -f backup_$(date +%Y%m%d).dump
```

### Point-in-Time Recovery
- Enable WAL archiving
- Configure archive_mode = on
- Store WAL files securely

---

## Monitoring Queries

### Table Sizes
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Active Connections
```sql
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```

### Slow Queries
```sql
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## Database Connection String

### Development
```
postgresql://username:password@localhost:5432/syntax_db
```

### Production (Supabase)
```
postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
```

---

**Version:** 1.0.0  
**Last Updated:** 2026-08-23  
**Author:** Senior Full Stack Engineer
