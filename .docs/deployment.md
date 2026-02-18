# Stogra Deployment Guide

Complete step-by-step deployment guide for Stogra (Backend → Koyeb, Frontend → Cloudflare Pages).

---

## Prerequisites

### Required Accounts

| Service | Purpose | Sign Up |
|---------|---------|---------|
| GitHub | Code repository | [github.com](https://github.com) |
| Koyeb | Backend hosting | [koyeb.com](https://www.koyeb.com) |
| Cloudflare | Frontend hosting | [cloudflare.com](https://dash.cloudflare.com) |

### Required Tools

```bash
# Git (version control)
git --version

# Node.js 20+ (frontend build)
node --version

# Python 3.11+ (backend local dev)
python --version
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              CLOUDFLARE PAGES (Frontend)                     │
│              https://stogra.pages.dev                        │
│              - React 19 + Vite                               │
│              - Static site (SSG)                             │
└─────────────────────────┬───────────────────────────────────┘
                          │ API calls
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              KOYEB TOKYO (Backend)                           │
│              https://stogra-api-xxx.koyeb.app                │
│              - FastAPI + Uvicorn                             │
│              - yfinance data provider                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 1: Backend Deployment (Koyeb)

### Step 1.1: Push Code to GitHub

Ensure your code is pushed to the main branch:

```bash
git status
git push origin main
```

Repository: https://github.com/tinodau/stogra

---

### Step 1.2: Create Koyeb Account

1. Go to [Koyeb Console](https://app.koyeb.com)
2. Sign up with GitHub (recommended for easy repo access)
3. Authorize Koyeb to access your repositories

---

### Step 1.3: Create New Service

1. Click **"Create Service"** or **"Deploy your own application"**
2. Select **GitHub** as deployment method
3. Authorize and select repository: `tinodau/stogra`
4. Configure deployment settings:

| Setting | Value |
|---------|-------|
| **Branch** | `main` |
| **Region** | Tokyo (NRT) - `asia-northeast` |
| **Instance Type** | Nano ($2.50/mo) |
| **Port** | `8000` |

---

### Step 1.4: Configure Build Settings

Koyeb will auto-detect the Dockerfile. Verify:

| Setting | Value |
|---------|-------|
| **Build Method** | Dockerfile |
| **Dockerfile Path** | `server/Dockerfile` |
| **Docker Context** | `server` |

If auto-detection fails, set manually:
- **Build path**: `server`
- **Dockerfile**: `server/Dockerfile`

---

### Step 1.5: Set Environment Variables

In the Koyeb service configuration, add these environment variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `ALLOWED_ORIGINS` | `https://stogra.pages.dev,https://*.pages.dev` | Will update after frontend deploy |
| `ENV` | `production` | Production mode |
| `DEBUG` | `false` | Disable debug mode |

**Note:** Start with `https://*.pages.dev` as wildcard to accept any Cloudflare Pages URL.

---

### Step 1.6: Configure Health Check

In the service settings, configure health check:

| Setting | Value |
|---------|-------|
| **Health Check Path** | `/health` |
| **Health Check Interval** | 30s |
| **Health Check Timeout** | 10s |

---

### Step 1.7: Deploy Backend

1. Click **"Deploy"** or **"Create Service"**
2. Wait for build to complete (2-3 minutes)
3. Check logs for: `🚀 Stogra API starting up...`
4. Note your Koyeb URL: `https://stogra-api-<random>.koyeb.app`

---

### Step 1.8: Verify Backend

Test the deployed API:

```bash
# Health check
curl https://stogra-api-xxx.koyeb.app/health

# Expected response:
# {"status":"operational","version":"1.0.0"}

# Test stocks endpoint
curl "https://stogra-api-xxx.koyeb.app/api/stocks?symbols=AAPL,MSFT"

# Test market snapshot
curl https://stogra-api-xxx.koyeb.app/api/market/snapshot
```

---

## Part 2: Frontend Deployment (Cloudflare Pages)

### Step 2.1: Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create application**
3. Select **Pages** → **Connect to Git**
4. Connect your GitHub account and select `tinodau/stogra`

---

### Step 2.2: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Project name** | `stogra` |
| **Root directory** | `client` |
| **Framework preset** | Vite |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

---

### Step 2.3: Set Environment Variables

Before the first deploy, set environment variables:

1. Go to **Settings** → **Environment variables**
2. Add **Production** variable:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://stogra-api-xxx.koyeb.app` |

Replace `xxx` with your actual Koyeb subdomain.

---

### Step 2.4: Deploy Frontend

1. Click **"Save and Deploy"**
2. Wait for build to complete (1-2 minutes)
3. Note your Pages URL: `https://stogra.pages.dev`

If the project name is taken, Cloudflare will generate: `https://stogra-<random>.pages.dev`

---

### Step 2.5: Verify Frontend

1. Open your Pages URL in browser
2. Check that:
   - Page loads without errors
   - Market data displays (indices, stocks)
   - Console shows API calls to your Koyeb backend

Open DevTools Console (F12) and check:
- No CORS errors
- API requests going to `VITE_API_URL`

---

## Part 3: Update CORS (Post-Deploy)

### Step 3.1: Update Koyeb CORS

After you have your final Cloudflare Pages URL, update Koyeb environment:

1. Go to Koyeb Console → Your Service → **Configuration**
2. Edit environment variable `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://stogra.pages.dev
```

Or if using random subdomain:
```
ALLOWED_ORIGINS=https://stogra-abc123.pages.dev
```

3. **Redeploy** the service for changes to take effect

---

### Step 3.2: Final Verification

Test the full flow:

1. **Frontend loads**: `https://stogra.pages.dev`
2. **API health check**: `https://stogra-api-xxx.koyeb.app/health`
3. **CORS works**: No errors in browser console
4. **Data loads**: Stocks, news, earnings display correctly

---

## Environment Variables Reference

### Frontend (Cloudflare Pages)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | `https://stogra-api.koyeb.app` | Backend API base URL |

Set in: Cloudflare Dashboard → Pages → Settings → Environment variables

---

### Backend (Koyeb)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ALLOWED_ORIGINS` | Yes | - | CORS allowed origins (comma-separated) |
| `ENV` | No | `development` | Environment mode |
| `DEBUG` | No | `true` | Enable debug mode |

Set in: Koyeb Console → Service → Configuration → Environment

---

## Deployment Checklist

### Pre-Deploy

- [ ] Code pushed to GitHub main branch
- [ ] Backend Dockerfile exists at `server/Dockerfile`
- [ ] Frontend builds successfully: `cd client && npm run build`
- [ ] `.env.example` files are committed (not `.env` with secrets)

### Backend (Koyeb)

- [ ] Koyeb account created
- [ ] Service created from GitHub repo
- [ ] Region set to Tokyo (NRT)
- [ ] Environment variables configured
- [ ] Health check at `/health` configured
- [ ] Deployment successful
- [ ] API health check returns `{"status":"operational"}`

### Frontend (Cloudflare Pages)

- [ ] Cloudflare account created
- [ ] Pages project connected to GitHub repo
- [ ] Build settings configured (root: `client`)
- [ ] `VITE_API_URL` environment variable set
- [ ] Deployment successful
- [ ] Page loads without errors
- [ ] API calls work (no CORS errors)

### Post-Deploy

- [ ] `ALLOWED_ORIGINS` updated with actual frontend URL
- [ ] Backend redeployed with new CORS settings
- [ ] Full end-to-end test passed

---

## Troubleshooting

### CORS Errors

**Symptom**: Browser console shows CORS errors

**Solution**:
1. Check `ALLOWED_ORIGINS` in Koyeb includes your Pages URL
2. Ensure no trailing slashes in URLs
3. Redeploy backend after changing environment variables

---

### API 500 Errors

**Symptom**: API returns 500 Internal Server Error

**Solution**:
1. Check Koyeb logs for error details
2. Common causes:
   - yfinance rate limiting (wait and retry)
   - Invalid ticker symbol
   - Network timeout

---

### Frontend Blank Page

**Symptom**: Page loads but shows blank

**Solution**:
1. Check browser console for JavaScript errors
2. Verify `VITE_API_URL` is set correctly
3. Check build output in Cloudflare Pages logs
4. Ensure `dist` folder is not empty

---

### Environment Variables Not Applied

**Symptom**: Changes to env vars don't take effect

**Solution**:
- **Cloudflare Pages**: Clear build cache and redeploy
- **Koyeb**: Redeploy service after changing env vars

---

## Useful Commands

### Local Development

```bash
# Backend
cd server
cp .env.example .env
uvicorn app.main:app --reload --port 8000

# Frontend
cd client
cp .env.example .env.local
# Edit .env.local and set VITE_API_URL=http://localhost:8000
npm run dev
```

### Test Production Build Locally

```bash
# Frontend
cd client
npm run build
npm run preview

# Backend
cd server
docker build -t stogra-api .
docker run -p 8000:8000 --env-file .env stogra-api
```

### Check Deployment Status

```bash
# Backend health
curl https://stogra-api-xxx.koyeb.app/health

# Frontend (should return HTML)
curl https://stogra.pages.dev
```

---

## Cost Estimate

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Koyeb | Nano | $2.50/mo |
| Cloudflare Pages | Free | $0/mo |
| GitHub | Free | $0/mo |
| **Total** | | **$2.50/mo** |

---

## Support

- **Koyeb Docs**: https://www.koyeb.com/docs
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **Project Issues**: https://github.com/tinodau/stogra/issues
