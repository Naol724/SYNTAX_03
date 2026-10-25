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
git commit -m "Sync full content catalog to production"
git push origin main
```
Or in Render: **Manual Deploy** → **Deploy latest commit**.

Build command (already in `render.yaml`):
`npm install --include=dev && npm run build`

Start command:
`npm start`

Health check: `/api/health`

## 4. After deploy — make live match local
Deployed Mongo often still has the **old tiny seed** (3 services, 2 projects). Local has the full catalog (**8 services, 12 projects**).

1. **Push + Manual Deploy** this latest code on Render (required — old live code cannot fix the DB).
2. Open this once (no login):  
   **https://syntax-03.onrender.com/api/sync-content**  
   You should see `"services": 8` and `"portfolio": 12` in the JSON.
3. Or open **https://syntax-03.onrender.com/api/health** — check `counts`.
4. Hard-refresh the website / admin.

**Why health alone looked OK but data was wrong:** Mongo was connected (`store.mode: mongo`), but it still held the old 2/3-item seed. The upgrade runs only after this new code is deployed.
