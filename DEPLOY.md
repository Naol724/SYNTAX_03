# Redeploy checklist (existing Render / host)

## 1. Local verify
```bash
npm install
npm run build
npm start
```
Open http://localhost:3000 and spot-check Home → About → Services → Admin.

## 2. Environment on the live service
In Render → your web service → **Environment**, set at least:

| Key | Notes |
|-----|--------|
| `MONGODB_URI` | Real Atlas URI (`cluster0.xxxxx.mongodb.net`) |
| `DATABASE_URL` | Same as `MONGODB_URI` |
| `USE_FILE_DB` | `false` in production |
| `NEXTAUTH_URL` | Exact public URL, e.g. `https://your-app.onrender.com` |
| `NEXTAUTH_SECRET` | Long random string |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Your admin login |

See `.env.example` for the full list.

## 3. Push & deploy
```bash
git add -A
git commit -m "Perf + admin content sync + contact messages"
git push origin main
```
Or in Render: **Manual Deploy** → **Deploy latest commit**.

Build command (already in `render.yaml`):
`npm install --include=dev && npm run build`

Start command:
`npm start`

Health check: `/api/health`

## 4. After deploy
1. Open the live site and confirm pages navigate quickly.
2. Log in at `/admin/login` and open **Dashboard** (or click **Refresh**) — empty collections auto-fill with the same services / projects / blog / testimonials / team shown on the public site.
3. Optional: `POST /api/admin/seed` (while logged in) forces a sync.
4. Send a test message from `/contact` and confirm it appears under Admin → Messages.

**Important:** Public pages and admin both read the same store. If admin looked empty before, it was because production Mongo was empty while the marketing pages still showed built-in copy — seeding on deploy fixes that.
