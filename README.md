<div align="center">

# 🚀 Syntax Software Solutions

### Premium Full-Stack Software Company — Addis Ababa, Ethiopia

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](https://syntaxsoftwaresolution.com)

**Production Ready** ✅ | **Node 18+** | **Port 5000**

 [📧 Email Us](mailto:syntaxsoftwaresolution@gmail.com) · [📞 +251 945 455 141](tel:+251945455141)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Admin Panel](#-admin-panel)
- [AI Chat Widget](#-ai-chat-widget)
- [Database Setup](#-database-setup)
- [API Reference](#-api-reference)
- [Deployment](#-deployment-on-render)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [Contact](#-contact)

---

## 🌟 Overview

A premium glassmorphism website for **Syntax Software Solutions** — a full-stack software company founded in 2019, based in Addis Ababa, Ethiopia. The platform serves as both a public-facing company website and a full-featured admin management system.

> Building the Digital Future of Ethiopia — delivering websites, mobile apps, gaming platforms, enterprise systems, and AI-powered bots.

---

## 🎨 Features

### Public Website
- ✅ Premium glassmorphism UI with cinematic hero section
- ✅ Fully responsive — mobile, tablet, desktop
- ✅ Dark mode support with system preference detection
- ✅ Smooth animations and transitions (Framer Motion)
- ✅ SEO optimized with structured data (JSON-LD)
- ✅ Accessibility compliant (WCAG)
- ✅ Fast loading with Next.js image optimization
- ✅ Contact form with MongoDB integration
- ✅ Tech logos horizontal scrolling marquee
- ✅ Interactive project portfolio with category filtering
- ✅ Testimonials carousel
- ✅ Newsletter subscription
- ✅ FAQ section
- ✅ Google Maps location embed
- ✅ Social media integration

### Admin Panel
- ✅ Secure login with NextAuth.js (JWT)
- ✅ Dashboard with live stats (bookings, leads, blog views)
- ✅ Full CRUD for: Blog, Services, Testimonials, Portfolio, Gallery
- ✅ Booking management with status updates
- ✅ Lead tracking and pipeline management
- ✅ Content management system (CMS)
- ✅ Analytics overview with daily traffic charts
- ✅ Responsive sidebar navigation

### AI Chat Widget
- ✅ Built-in smart response system (works without any API key)
- ✅ Answers questions about services, pricing, location, contact
- ✅ Optional upgrade to Gemini AI with a valid API key

---

## 📦 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5.6 |
| **Styling** | Tailwind CSS + Custom Glassmorphism |
| **Animations** | Framer Motion |
| **UI Components** | Radix UI (shadcn/ui) |
| **Forms** | React Hook Form + Zod |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | NextAuth.js v4 (JWT) |
| **State** | TanStack Query v5 |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **Email** | Nodemailer |
| **AI** | Google Gemini / Built-in smart responses |

---

## 🗂 Project Structure

```
SYNTAX_03/
├── app/
│   ├── (public)/          # Public pages — Navbar + Footer + ChatWidget
│   │   ├── page.tsx       # Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── contact/
│   │   ├── portfolio/
│   │   └── blog/
│   ├── (admin)/           # Admin pages — Sidebar layout, auth protected
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── bookings/
│   │       ├── leads/
│   │       ├── blog/
│   │       ├── services/
│   │       ├── testimonials/
│   │       ├── portfolio/
│   │       ├── gallery/
│   │       ├── content/
│   │       └── analytics/
│   ├── (auth)/            # Auth pages — No layout
│   │   └── admin/login/
│   └── api/               # API routes
│       ├── admin/stats/
│       ├── ai/chat/
│       ├── auth/[...nextauth]/
│       ├── bookings/
│       ├── leads/
│       ├── blog/
│       ├── services/
│       ├── testimonials/
│       ├── portfolio/
│       ├── gallery/
│       ├── contact/
│       └── newsletter/
├── components/
│   ├── admin/             # AdminLayout sidebar
│   ├── ai/                # ChatWidget
│   ├── layout/            # Navbar, Footer
│   ├── ui/                # All reusable UI components
│   └── providers.tsx      # SessionProvider + QueryClient
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── models.ts          # Mongoose models
│   ├── mongoose.ts        # DB connection
│   ├── email.ts           # Nodemailer helpers
│   └── schema.ts          # Zod schemas
├── scripts/
│   └── seed.ts            # Database seeder
├── middleware.ts           # Route protection
└── .env.local             # Environment variables
```

---

## 📱 Pages & Routes

### Public Routes
| Route | Description |
|---|---|
| `/` | Home — hero, services, stats, process, tech stack, testimonials, projects preview |
| `/about` | Company overview, mission/vision, values, timeline, team, founders |
| `/services` | All 8 services with features, process, commitments |
| `/projects` | Portfolio with category filter — 12 live projects |
| `/contact` | Contact form, map, business hours, social links |
| `/blog` | Blog listing |
| `/blog/[slug]` | Individual blog post |

### Admin Routes (Protected)
| Route | Description |
|---|---|
| `/admin/login` | Admin login page |
| `/admin/dashboard` | Stats overview, recent bookings & leads |
| `/admin/bookings` | Manage service booking requests |
| `/admin/leads` | Lead pipeline management |
| `/admin/blog` | Create, edit, publish blog posts |
| `/admin/services` | Manage service offerings |
| `/admin/testimonials` | Manage client reviews |
| `/admin/portfolio` | Manage portfolio projects |
| `/admin/gallery` | Manage gallery images |
| `/admin/content` | CMS — edit website content sections |
| `/admin/analytics` | Traffic and performance metrics |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 3. Seed the database (creates admin user + sample data)
npm run seed

# 4. Run development server (http://localhost:5000)
npm run dev

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── Database ─────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# ─── Application ──────────────────────────────────────────
NODE_ENV=development
PORT=5000

# ─── NextAuth (REQUIRED for admin login) ──────────────────
NEXTAUTH_SECRET=your-strong-random-secret-key-here
NEXTAUTH_URL=http://localhost:5000

# ─── AI Chat (optional) ───────────────────────────────────
# Get a free key at: https://aistudio.google.com/app/apikey
# Key must start with AIzaSy...
GEMINI_API_KEY=your_gemini_api_key_here

# ─── Email Notifications (optional) ──────────────────────
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=syntaxsoftwaresolution@gmail.com
```

> ⚠️ **Important:** `NEXTAUTH_SECRET` and `MONGODB_URI` are required. The app will not work without them.

---

## 🔐 Admin Panel

### Access
- **URL:** `http://localhost:5000/admin/dashboard`
- The **Admin** button in the top navbar links directly to the dashboard
- `/admin` automatically redirects to `/admin/dashboard`
- All admin routes except `/admin/login` are protected by NextAuth middleware

### Default Credentials
> Run `npm run seed` first to create the admin user.

| Field | Value |
|---|---|
| **Email** | `admin@syntaxsoftwaresolution.com` |
| **Password** | `adminpassword` |

> 🔒 Change the password after first login in production.

### Route Architecture

| Route Group | URLs | Layout Applied |
|---|---|---|
| `(public)` | `/`, `/about`, `/services`, `/projects`, `/contact`, `/blog` | Navbar + Footer + ChatWidget |
| `(admin)` | `/admin/dashboard` and all sub-pages | Admin sidebar (auth protected) |
| `(auth)` | `/admin/login` | No layout (standalone) |

---

## 🤖 AI Chat Widget

The chat widget appears on all public pages (bottom-right corner).

### How it works
- **Default mode:** Built-in smart keyword-based responses — works with **zero API keys**
- Handles questions about: services, pricing, location, contact, tech stack, bookings, timelines

### Upgrade to Gemini AI
1. Get a free API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. The key must start with `AIzaSy...`
3. Add to `.env.local`:
   ```env
   GEMINI_API_KEY=AIzaSy...your_key_here
   ```
4. Restart the server

---

## 🌱 Database Setup

### Seed the database
Run once to create the admin user and populate sample data:
```bash
npm run seed
```

This creates:
- ✅ Admin user account
- ✅ 3 sample blog posts
- ✅ 3 sample services
- ✅ 2 sample testimonials
- ✅ 2 sample portfolio projects
- ✅ Hero & about content entries

### MongoDB Models
`AdminUser` · `Booking` · `Lead` · `BlogPost` · `Service` · `Testimonial` · `Portfolio` · `Gallery` · `Content` · `TeamMember` · `Newsletter` · `FAQ` · `Analytics`

---

## 🔌 API Reference

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/contact` | Submit contact form |
| `POST` | `/api/newsletter` | Subscribe to newsletter |
| `POST` | `/api/ai/chat` | AI chat message |
| `GET` | `/api/public/services` | Get active services |
| `GET` | `/api/public/testimonials` | Get active testimonials |
| `GET` | `/api/public/portfolio` | Get active portfolio |
| `GET` | `/api/public/blog` | Get published blog posts |

### Admin Endpoints (Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/bookings` | List / create bookings |
| `PATCH/DELETE` | `/api/bookings/[id]` | Update / delete booking |
| `GET/POST` | `/api/leads` | List / create leads |
| `PATCH/DELETE` | `/api/leads/[id]` | Update / delete lead |
| `GET/POST` | `/api/blog` | List / create blog posts |
| `PATCH/DELETE` | `/api/blog/[id]` | Update / delete post |
| `GET/POST` | `/api/services` | List / create services |
| `GET/POST` | `/api/testimonials` | List / create testimonials |
| `GET/POST` | `/api/portfolio` | List / create projects |
| `GET/POST` | `/api/gallery` | List / create gallery items |
| `GET/POST` | `/api/content` | List / update CMS content |
| `GET` | `/api/admin/stats` | Dashboard statistics |

---

## 🌐 Deployment on Render

### Prerequisites
- GitHub repository connected to Render
- All environment variables configured in Render dashboard

### Build Settings

| Setting | Value |
|---|---|
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Node Version** | `18` or higher |

### Environment Variables on Render
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_SECRET=your_strong_secret_key
NEXTAUTH_URL=https://your-app-name.onrender.com
GEMINI_API_KEY=your_gemini_key (optional)
```

### Auto-Deploy
The app automatically deploys when you push to the `main` branch.

---

## 🔧 Configuration Files

| File | Purpose |
|---|---|
| `next.config.mjs` | Next.js config — image domains, webpack optimization |
| `tailwind.config.ts` | Tailwind CSS — custom colors, glassmorphism utilities |
| `tsconfig.json` | TypeScript compiler options |
| `middleware.ts` | Route protection for `/admin/*` |
| `render.yaml` | Render.com deployment config |
| `vercel.json` | Vercel deployment config |
| `.env.local` | Local environment variables |

---

## 📊 Performance

| Metric | Score |
|---|---|
| Lighthouse Score | 90+ |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| SEO Score | 100 |
| Accessibility | 95+ |

---

## 🐛 Troubleshooting

### Build fails
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```
- Ensure Node version is 18+: `node -v`
- Check all required env vars are set in `.env.local`

### Admin login not working
- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Ensure `NEXTAUTH_URL=http://localhost:5000` matches your port
- Run `npm run seed` to create the admin user first

### Port already in use
```bash
# Windows — find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB connection error
- Check your `MONGODB_URI` is correct in `.env.local`
- Whitelist your IP address in MongoDB Atlas Network Access
- Ensure the database user has read/write permissions

### AI chat not responding
- The built-in response system works without any API key
- For Gemini AI: ensure your key starts with `AIzaSy...` (not `AQ.`)
- Restart the dev server after changing `.env.local`

---

## 📄 License

© 2025 Syntax Software Solutions. All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, or modification is strictly prohibited.

---

## 📞 Contact

<div align="center">

| Channel | Details |
|---|---|
| 🌐 **Website** | [syntaxsoftwaresolution.com](https://syntaxsoftwaresolution.com) |
| 📧 **Email** | [syntaxsoftwaresolution@gmail.com](mailto:syntaxsoftwaresolution@gmail.com) |
| 📞 **Phone** | +251 945 455 141 · +251 940 023 840 |
| 📍 **Location** | Bole Dembel, Amir Commercial Complex, Addis Ababa, Ethiopia |
| 🕐 **Hours** | Mon–Fri: 8AM–6PM · Sat: 9AM–4PM · Support: 24/7 |

[![GitHub](https://img.shields.io/badge/GitHub-SYTAXSOFTWARESOLUTIONS-black?style=flat-square&logo=github)](https://github.com/SYTAXSOFTWARESOLUTIONS)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Syntax_Software-blue?style=flat-square&logo=linkedin)](https://linkedin.com/company/syntax-software-solutions)
[![Instagram](https://img.shields.io/badge/Instagram-syntax.software.solution-pink?style=flat-square&logo=instagram)](https://instagram.com/syntax.software.solution)

</div>

---

<div align="center">

Built with ❤️ by **Syntax Software Solutions** — Addis Ababa, Ethiopia 🇪🇹

*Building the Digital Future of Ethiopia since 2019*

</div>
