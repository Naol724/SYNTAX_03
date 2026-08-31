# Quick Start Guide

## SYNTAX Website - Get Started in 10 Minutes

**Current Phase:** Phase 1 Complete (Database Design) ✅  
**Next Phase:** Phase 2 (Backend Architecture) ⏭️

---

## 🚀 Quick Start (Development)

### Prerequisites
- ✅ Node.js 18+ installed
- ✅ Git installed
- ✅ Code editor (VS Code recommended)
- ✅ Supabase account (or PostgreSQL locally)

### 1. Clone & Install (2 minutes)

```bash
# Navigate to project directory
cd "c:\Users\Naol\Desktop\Unit project\SYNTAX NEW\SYNTAX_03\SYNTAX_03"

# Install frontend dependencies (if package.json exists)
npm install

# Install backend dependencies (Phase 2+)
# cd backend && npm install
```

### 2. Set Up Database (5 minutes)

#### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project (name: `syntax-website`)
3. Wait for project to provision (2-3 minutes)
4. Go to SQL Editor
5. Copy contents of `database/migrations/001_initial_schema.sql`
6. Paste and run in SQL Editor
7. Verify: Should see "Success. No rows returned"

**Detailed guide:** See `database/supabase_setup.md`

#### Option B: Local PostgreSQL

```bash
# Install PostgreSQL (if not installed)
# Windows: Download from https://www.postgresql.org/download/

# Create database
psql -U postgres -c "CREATE DATABASE syntax_db;"

# Run migration
psql -U postgres -d syntax_db -f database/migrations/001_initial_schema.sql

# Verify
psql -U postgres -d syntax_db -c "\dt"
```

### 3. Configure Environment (2 minutes)

Copy `.env.example` to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Connection
DATABASE_URL=postgresql://postgres:PASSWORD@db.YOUR-PROJECT.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=your-random-secret-here-min-32-chars
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Grok API (Phase 10+)
GROK_API_KEY=your-grok-api-key-here

# Environment
NODE_ENV=development
```

**Get Supabase credentials:**
1. Go to Project Settings > API
2. Copy `Project URL` → NEXT_PUBLIC_SUPABASE_URL
3. Copy `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Copy `service_role` key → SUPABASE_SERVICE_ROLE_KEY (keep secret!)
5. Go to Project Settings > Database
6. Copy connection string → DATABASE_URL

### 4. Verify Setup (1 minute)

Test database connection in Supabase SQL Editor:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Should return 11 tables:
-- admins, users, services, portfolio, blog, testimonials,
-- developers, messages, ai_chat_assistant, refresh_tokens, analytics_events

-- Check views
SELECT table_name FROM information_schema.views WHERE table_schema = 'public';

-- Should return 4 views:
-- vw_published_portfolio, vw_published_blogs,
-- vw_active_services, vw_message_stats
```

---

## 📁 What You Have Now

### Phase 1 Complete ✅

```
SYNTAX_03/
├── database/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql     ✅ Database schema
│   │   └── 002_rollback.sql           ✅ Rollback script
│   ├── database.types.ts              ✅ TypeScript types
│   ├── ER_DIAGRAM.md                  ✅ ER documentation
│   ├── supabase_setup.md              ✅ Setup guide
│   └── README.md                      ✅ Database docs
├── PHASE_1_SUMMARY.md                 ✅ Phase 1 summary
├── PROJECT_OVERVIEW.md                ✅ Project overview
└── QUICK_START.md                     ✅ This file
```

### What's Working
- ✅ Complete database schema (11 tables)
- ✅ TypeScript type definitions
- ✅ Comprehensive documentation
- ✅ Migration and rollback scripts
- ✅ Supabase configuration guide

### What's Next (Phase 2)
- ⏭️ Backend folder structure
- ⏭️ Express.js setup
- ⏭️ Clean architecture (controllers, services, repositories)
- ⏭️ Middleware (auth, validation, error handling)
- ⏭️ API routes
- ⏭️ Database connection

---

## 🎯 Quick Reference

### Important Files

| File | Purpose | Status |
|------|---------|--------|
| `database/migrations/001_initial_schema.sql` | Database schema | ✅ Ready |
| `database/database.types.ts` | TypeScript types | ✅ Ready |
| `database/ER_DIAGRAM.md` | Database documentation | ✅ Ready |
| `database/supabase_setup.md` | Supabase guide | ✅ Ready |
| `.env.local` | Environment variables | ⚠️ Create this |
| `backend/` | Backend code | ⏭️ Phase 2 |
| `app/` | Frontend pages | ⏭️ Phase 12 |

### Database Tables

| Table | Purpose | Records (Initial) |
|-------|---------|-------------------|
| admins | Admin users | 0 (create in Phase 3) |
| users | Registered users | 0 |
| services | Company services | 0 |
| portfolio | Projects | 0 |
| blog | Blog posts | 0 |
| testimonials | Client reviews | 0 |
| developers | Team members | 0 |
| messages | User messages | 0 |
| ai_chat_assistant | AI conversations | 0 |
| refresh_tokens | JWT tokens | 0 |
| analytics_events | Analytics | 0 |

### Supabase Storage Buckets (Create These)

| Bucket | Purpose | Max Size | Public |
|--------|---------|----------|--------|
| portfolio-images | Project screenshots | 5 MB | Yes |
| blog-images | Article images | 3 MB | Yes |
| developer-avatars | Team photos | 2 MB | Yes |
| testimonial-avatars | Client photos | 1 MB | Yes |

**Create buckets in Supabase:**
1. Go to Storage in Supabase dashboard
2. Click "New bucket"
3. Set name, size limit, and public access
4. Configure RLS policies (see `database/supabase_setup.md`)

---

## 🔧 Development Workflow

### Phase 1 Checklist ✅

- [x] Review database schema (`database/migrations/001_initial_schema.sql`)
- [x] Understand entity relationships (`database/ER_DIAGRAM.md`)
- [x] Set up Supabase account and project
- [x] Run database migration
- [x] Verify tables and views created
- [x] Configure environment variables (`.env.local`)
- [x] Create storage buckets in Supabase
- [x] Review TypeScript types (`database/database.types.ts`)

### Phase 2 Preview ⏭️

What we'll build in Phase 2:

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts           # DB connection
│   │   └── environment.ts        # Env validation
│   ├── types/
│   │   └── index.ts              # Shared types
│   ├── utils/
│   │   ├── logger.ts             # Winston logger
│   │   └── errors.ts             # Error classes
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── validate.middleware.ts # Zod validation
│   │   └── error.middleware.ts   # Error handler
│   ├── controllers/
│   │   └── [modules]             # HTTP handlers
│   ├── services/
│   │   └── [modules]             # Business logic
│   ├── repositories/
│   │   └── [modules]             # Data access
│   ├── routes/
│   │   └── [modules]             # API routes
│   └── app.ts                    # Express app
├── package.json
└── tsconfig.json
```

**Estimated Time:** 2-3 hours  
**Complexity:** Medium

---

## 📚 Learning Resources

### Must Read Before Phase 2
1. **Clean Architecture Basics**
   - [Clean Architecture Overview](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
   - Controllers → Services → Repositories pattern

2. **Express.js with TypeScript**
   - [Express.js Documentation](https://expressjs.com/)
   - [TypeScript with Express](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)

3. **Database Connection**
   - [node-postgres (pg) Documentation](https://node-postgres.com/)
   - [Connection pooling best practices](https://node-postgres.com/features/pooling)

### Helpful Tools
- **VS Code Extensions:**
  - ESLint
  - Prettier
  - PostgreSQL Explorer
  - REST Client (for API testing)
  - Thunder Client (Postman alternative)

- **Database Tools:**
  - [DBeaver](https://dbeaver.io/) - Universal DB client
  - [Postman](https://www.postman.com/) - API testing
  - Supabase Dashboard - Built-in SQL editor

---

## ⚡ Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
1. Check Supabase project is active (not paused)
2. Verify DATABASE_URL is correct
3. Test connection in Supabase SQL Editor
4. Check firewall/network settings

### Issue: "Migration fails with syntax error"
**Solution:**
1. Ensure you're using PostgreSQL 14+
2. Copy entire file contents (don't copy partially)
3. Run in Supabase SQL Editor (not psql)
4. Check for special characters in password

### Issue: "Environment variables not loading"
**Solution:**
1. File must be named `.env.local` (not `.env`)
2. Restart development server after changes
3. No spaces around `=` in env file
4. Check file is in project root

### Issue: "Tables created but no views"
**Solution:**
1. Views are created at end of migration
2. Check for errors in migration output
3. Manually run view creation SQL
4. Verify with: `SELECT * FROM information_schema.views;`

---

## 🎉 You're Ready!

### Current Status
- ✅ Database designed and documented
- ✅ TypeScript types generated
- ✅ Supabase configured (or local PostgreSQL)
- ✅ Environment variables set
- ✅ Storage buckets created

### Next Steps
1. **Review Phase 1 deliverables** (15 minutes)
   - Read `database/ER_DIAGRAM.md`
   - Review `database/database.types.ts`
   - Understand table relationships

2. **Test database connection** (5 minutes)
   - Run verification queries
   - Check all tables exist
   - Verify views are created

3. **Continue to Phase 2** (Ready?)
   - Backend architecture design
   - Express.js setup
   - Clean architecture implementation

---

## 📞 Need Help?

### Documentation
- [Database README](./database/README.md) - Complete database guide
- [ER Diagram](./database/ER_DIAGRAM.md) - Table relationships
- [Supabase Setup](./database/supabase_setup.md) - Detailed setup guide
- [Phase 1 Summary](./PHASE_1_SUMMARY.md) - What was delivered
- [Project Overview](./PROJECT_OVERVIEW.md) - Full project plan

### External Resources
- [Supabase Discord](https://discord.supabase.com) - Community support
- [PostgreSQL Docs](https://www.postgresql.org/docs/) - Official docs
- [Next.js Discord](https://discord.gg/nextjs) - Framework support

---

## ✅ Ready for Phase 2?

**Before continuing, ensure:**
- [x] Database schema is deployed
- [x] All tables are created
- [x] Environment variables are configured
- [x] You understand the database structure
- [x] TypeScript types are reviewed

**If all checked, say:** "Check complete, continue to Phase 2"

---

**Time Investment So Far:** ~30 minutes  
**Time for Phase 2:** ~2-3 hours  
**Total Progress:** 7% (1/14 phases)

**Let's build the backend next! 🚀**

---

**Version:** 1.0.0  
**Last Updated:** August 23, 2026
