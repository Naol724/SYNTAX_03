# Render Deployment Guide

## Step 1: Push to GitHub
```bash
git push origin main
```

## Step 2: Create Web Service on Render
1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select your repo

## Step 3: Configure Service

**Name:** `syntax-software-solutions`

**Region:** `Oregon` or `Frankfurt`

**Branch:** `main`

**Runtime:** `Node`

**Build Command:**
```
npm install && npm run build
```

**Start Command:**
```
npm start
```

**Plan:** `Free` (or Starter $7/month for always-on)

## Step 4: Add Environment Variables

Click **Advanced** → Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb link` |

## Step 5: Deploy

Click **Create Web Service** → Wait 5-10 minutes

Your site will be live at: `https://syntax-software-solutions.onrender.com`

## Done!
Website is now live and auto-deploys on every git push.
