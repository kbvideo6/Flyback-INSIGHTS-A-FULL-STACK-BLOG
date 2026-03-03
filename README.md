# Flyback INSIGHTS

**A Full-Stack Tech Editorial Platform**

Flyback INSIGHTS is a dark-themed, glassmorphism-styled tech journalism site covering electronics, AI hardware, sensors, and robotics. It features a spatial "Node Canvas" interface for exploring topics, a dedicated reading experience, and a custom Admin CMS.

## 🏗 Architecture

### Frontend
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS v4 (CSS-native)
- **Visualization**: Custom Node Graph System

### Backend
- **Server**: Express.js (Node.js)
- **ORM**: Prisma 7
- **Database**: PostgreSQL (Supabase)
- **Storage**: Cloudflare R2 (Article Covers)
- **Auth**: Supabase Auth (Admin Access)

## 🚀 Features

### Public Experience
- **Spatial Discovery**: Interactive "Node Canvas" home page visualizing topic connections.
- **Rich Content**: "Deep Dive" and "Analysis" layouts for long-form technical articles.
- **Newsletter**: Dynamic subscription handling with reactivation support.

### Admin CMS (Planned)
- **Secure Dashboard**: Protected via Supabase Authentication.
- **Article Editor**: Rich text (WYSIWYG) editing with TipTap.
- **Media**: Drag-and-drop image uploads hosted on Cloudflare R2.

## 🛠 Project Structure

| Folder | Description |
|--------|-------------|
| `frontend/` | Next-gen React app with Tailwind v4 & Storybook |
| `backend/` | Express.js API with Prisma ORM & Supabase integration |
| `database/` | Legacy SQL migrations (superseded by Prisma) |
| `deploy/` | Dockerfiles and Vercel/Wrangler configurations |

## ⚡ Getting Started

### 1. Prerequisites
- Node.js 20+
- Supabase Account (for DB & Auth)
- Cloudflare Account (for R2 Storage)

### 2. Installation
```bash
# Install dependencies for both frontend and backend
npm run install:all
```

### 3. Environment Setup
Create `.env` files in `backend/` and `frontend/` using the provided templates (see Plan below).

### 4. Run Development Servers
```bash
# Terminal 1: Start Backend API (Port 3000)
npm run dev:backend

# Terminal 2: Start Frontend (Port 5173)
npm run dev:frontend
```

---

# 📅 Implementation Roadmap & Details

> This section details the execution plan for upgrading the current static site to a full-stack CMS.

## Plan: Full-Stack Architecture — Flyback INSIGHTS

**What**: Connect the existing React + Express skeleton to Supabase (PostgreSQL), add a protected admin CMS to create/publish articles, wire Cloudflare R2 for free image hosting, and replace all static frontend data with live API calls.

**How**: Supabase Auth handles the admin login (email + password, no CAPTCHA). TipTap provides the WYSIWYG editor. The Express backend gains a protected `/api/v1/admin/*` route group (JWT verified by Supabase). The frontend hooks replace `articles.js`. Cloudflare R2 is used (free tier: 10 GB storage, 1 M Class-A ops/month free — cost-friendliest Cloudflare option).

### Phase 1 — Supabase + Prisma Setup
- [ ] Create a Supabase project → copy `DATABASE_URL` (pooler) + `DIRECT_URL` (direct connection for migrations)
- [ ] Create `.env` with: `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Update `schema.prisma`:
    - Add `readTime Int?` and `coverImageUrl String?` to `Article` model
    - Change datasource to use both `url` (pooler) and `directUrl` (direct) for Prisma migrations
    - No separate Admin model needed — Supabase Auth manages the admin user
- [ ] Run `prisma migrate dev --name init` → creates all tables in Supabase PostgreSQL
- [ ] Run `prisma generate` → regenerates client in `backend/src/generated/prisma/`
- [ ] Seed the 16 articles from `articles.js` via a one-time `prisma/seed.js` script

### Phase 2 — Backend Auth Middleware (Supabase JWT)
- [ ] Install `@supabase/supabase-js` in `package.json`
- [ ] Fill in `auth.js`:
    - Extract `Authorization: Bearer <token>` header
    - Call `supabase.auth.getUser(token)` using the service-role client
    - Attach `req.user` and call `next()`, or return `401`
- [ ] Fill in `rateLimiter.js`:
    - Install `express-rate-limit`; 100 req/15 min for public, 20 req/15 min for admin
- [ ] Wire `errorHandler.js` — move inline error handler from `app.js` here and mount it

### Phase 3 — Admin API Routes (Backend)
- [ ] Create `backend/src/controllers/adminController.js`:
    - `listArticles` — all articles including drafts
    - `createArticle` — saves TipTap HTML/JSON body, cover image URL, metadata
    - `updateArticle` — full update
    - `togglePublish` — flips `isPublished` + sets `publishedAt`
    - `deleteArticle`
    - `uploadImage` — streams file to Cloudflare R2, returns public URL
- [ ] Create `backend/src/services/adminService.js` with Prisma calls for above
- [ ] Create `backend/src/routes/adminRoutes.js` — all routes wrapped with `auth` middleware:
    - `GET    /api/v1/admin/articles`
    - `POST   /api/v1/admin/articles`
    - `PUT    /api/v1/admin/articles/:id`
    - `PATCH  /api/v1/admin/articles/:id/publish`
    - `DELETE /api/v1/admin/articles/:id`
    - `POST   /api/v1/admin/upload`
- [ ] Mount admin routes in `index.js`
- [ ] Install `multer` (multipart upload) and `@aws-sdk/client-s3` (R2 is S3-compatible) in backend

### Phase 4 — Cloudflare R2 Image Hosting
- [ ] Create an R2 bucket in the Cloudflare dashboard (free tier)
- [ ] Generate an R2 API token (S3-compatible credentials)
- [ ] Add to `.env`: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT` (`https://<account-id>.r2.cloudflarestorage.com`)
- [ ] Enable R2 public access on the bucket (gets a `pub-<hash>.r2.dev` URL for free CDN delivery)
- [ ] The `uploadImage` controller: receive file via `multer`, `PutObjectCommand` to R2, return the public URL — this URL is stored in `Article.coverImageUrl`

### Phase 5 — Frontend Live API Integration
- [ ] Create `frontend/src/lib/api.js` — a thin fetch wrapper with `VITE_API_URL` base URL
- [ ] Create hooks in `hooks`:
    - `useCanvasData()` → `GET /api/v1/graph/canvas`
    - `useArticle(slug)` → `GET /api/v1/graph/articles/:slug`
    - `useCategories()` → `GET /api/v1/graph/categories`
    - `useTrends()` → `GET /api/v1/graph/trends`
- [ ] Replace `articles.js` imports in all pages with these hooks; add loading spinner + error state
- [ ] Wire `NewsletterSync.jsx` onSubmit → `POST /api/v1/newsletter/subscribe`
- [ ] Update `NodeCanvas.jsx` to render nodes from live `useCanvasData()` instead of hardcoded slugs
- [ ] Fix route casing in `App.jsx`: `/DeepDives` → `/deep-dives`, `/Analysis` → `/analysis`
- [ ] Add `VITE_API_URL=http://localhost:3000` to `frontend/.env`

### Phase 6 — Admin Panel (Frontend)
- [ ] Install in `package.json`: `@supabase/supabase-js`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`
- [ ] Create `useAuth()` hook in `frontend/src/hooks/useAuth.js` — wraps Supabase client session
- [ ] Create `ProtectedRoute` component — checks session, redirects to `/admin/login` if none
- [ ] New pages (use a separate `AdminLayout`, no public Navbar/Footer):
    - `frontend/src/pages/admin/AdminLogin.jsx` — email + password form, calls `supabase.auth.signInWithPassword()`, no CAPTCHA
    - `frontend/src/pages/admin/AdminDashboard.jsx` — article list table with Published/Draft badges + Edit/Delete actions
    - `frontend/src/pages/admin/ArticleEditor.jsx` — TipTap editor, title/excerpt/category/readTime fields, cover image upload (drag-and-drop → POST `/api/v1/admin/upload`), Publish/Save Draft toggle button
- [ ] Add admin routes to `App.jsx`:
    - `/admin/login` → `<AdminLogin />`
    - `/admin` and `/admin/articles` → `<ProtectedRoute><AdminDashboard /></ProtectedRoute>`
    - `/admin/articles/new` and `/admin/articles/:id/edit` → `<ProtectedRoute><ArticleEditor /></ProtectedRoute>`

### Phase 7 — Cleanup & Remaining Stubs
- [ ] Fill in `About.jsx` with real publication info
- [ ] Fill in `Contact.jsx` with a simple email form
- [ ] Fix Navbar mobile hamburger — add a slide-in drawer state in `Navbar.jsx`
- [ ] Delete the empty legacy files: `schema.sql`, `migrations`, `seeds`, `models`, `product.*` route/controller/service stubs
- [ ] Delete `Article.jsx` (unrouted duplicate of `ArticlePage.jsx`)

## Verification

- `npm run dev:backend` → server starts, Prisma connects to Supabase (`prisma.$connect()` succeeds)
- `GET http://localhost:3000/api/v1/graph/canvas` → returns live articles from Supabase
- `npm run dev:frontend` → Home NodeCanvas renders live article data
- Navigate to `/admin/login` → sign in with Supabase admin email → lands on dashboard
- Create an article in the editor, upload cover image (stored in R2, URL in article) → hit Publish
- Article appears on the public site immediately via live API

## Decisions

- **Supabase Auth** chosen over custom JWT — admin account created once in the Supabase dashboard, no public signup route needed
- **Cloudflare R2** chosen over Cloudflare Images — R2 free tier (10 GB, 1 M ops/month) is cost-free; Cloudflare Images is paid
- **TipTap** chosen for WYSIWYG — MIT licensed, headless, React-native, stores portable HTML/JSON
- **No robot check (CAPTCHA)** anywhere — as requested