# ⚡ Quick Reference Card

## 🚀 Get Running (3 Commands)

```bash
# 1. Generate auth secret and add to .env.local
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 2. Create admin user
npm run seed:admin

# 3. Start server
npm run dev
```

**Login:** http://localhost:5000/admin/login  
**Credentials:** admin@syntax.com / admin123

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables |
| `models/` | Database schemas |
| `lib/mongoose.ts` | DB connection |
| `lib/auth.ts` | NextAuth setup |
| `middleware.ts` | Route protection |
| `app/admin/login/` | Login page |
| `app/admin/dashboard/` | Dashboard |
| `scripts/seed-admin.ts` | Create admin user |

---

## 🗄 Database Models

1. **User** - Admin authentication
2. **Blog** - Blog posts with SEO
3. **Service** - Service offerings
4. **Portfolio** - Project showcase
5. **Booking** - Client bookings
6. **Testimonial** - Client feedback
7. **Message** - Contact messages (existing)

---

## 🔐 Admin Features

✅ Login/Logout  
✅ Session management  
✅ Protected routes  
✅ Dashboard UI  
✅ User profile  
⏳ Blog CMS (Phase 2)  
⏳ Portfolio CMS (Phase 2)  
⏳ Booking management (Phase 3)  
⏳ AI chatbot (Phase 4)  

---

## 🛠 Commands

```bash
npm run dev         # Dev server
npm run build       # Production build
npm start           # Production server
npm run seed:admin  # Create admin
npm run check       # TypeScript check
npm run lint        # Lint code
```

---

## 🔑 Environment Variables

Required in `.env.local`:

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=<generate-with-command-above>
NEXTAUTH_URL=http://localhost:5000
NODE_ENV=development
PORT=5000
```

---

## 📊 Phase Status

| Phase | Status | ETA |
|-------|--------|-----|
| 1. Foundation | ✅ Complete | Done |
| 2. Blog & Portfolio | 🔨 Next | 2 weeks |
| 3. Booking System | ⏳ Planned | 3 weeks |
| 4. AI Assistant | ⏳ Planned | 4 weeks |
| 5. Analytics | ⏳ Planned | 5 weeks |
| 6. Advanced | ⏳ Planned | 6 weeks |
| 7. Polish | ⏳ Planned | 7 weeks |
| 8. Deploy | ⏳ Planned | 8 weeks |

---

## 🔗 URLs

- **Public:** http://localhost:5000
- **Admin Login:** http://localhost:5000/admin/login
- **Dashboard:** http://localhost:5000/admin/dashboard
- **API Auth:** http://localhost:5000/api/auth

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Run `npm run seed:admin` |
| DB error | Check `MONGODB_URI` |
| Auth error | Set `NEXTAUTH_SECRET` |
| Port in use | Change `PORT` in .env |

---

## 📚 Documentation

1. `START_HERE.md` - Quick start
2. `PRO_PHASE1_COMPLETE.md` - Phase 1 details
3. `PRO_UPGRADE_PLAN.md` - Full roadmap
4. `PRO_SETUP_GUIDE.md` - Setup guide

---

**Syntax Software Solutions - Pro Package**  
**Phase 1 Complete ✅**
