# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Does

ScoutFlow is an AI-powered prospecting platform for digital agencies. It helps users find local businesses, generate digital audits, create personalized cold outreach emails, and manage leads through a sales pipeline. Core AI functionality uses Google Gemini; payments use Stripe; auth and database use Supabase.

## Commands

```bash
npm run dev       # Start local dev server (tsx server.ts — Express)
npm run build     # Vite production build → /dist
npm run preview   # Preview production build locally
npm run lint      # TypeScript type-check (tsc --noEmit)
npm run clean     # Remove /dist
```

No test runner is configured.

## Architecture

### Dual Runtime

The app runs differently locally vs. in production:

- **Local dev**: `server.ts` (Express, 611 lines) serves both the Vite-built frontend and all API routes under `/api/*`
- **Production (Vercel)**: Each file in `api/` becomes a serverless function; `vercel.json` routes `/api/*` to them and all other routes to the SPA

When adding or modifying API routes, changes must work in both runtimes. The Express server registers the same handler functions from `api/` files.

### Frontend

- `src/App.tsx` (~2100 lines) — monolithic component containing landing page, auth flows, dashboard, leads management, and all UI state. Uses `useState`/`useEffect` only — no external state management library.
- `src/services/api.ts` — all fetch calls to backend API routes; sends Supabase JWT via `Authorization: Bearer` header
- `src/services/geminiService.ts` — Gemini API calls for business search, website audits, outreach generation, and action plans
- `src/services/supabaseClient.js` — Supabase browser client initialization

### Backend API Routes (`api/`)

| Route | Purpose |
|---|---|
| `login.ts`, `signup.ts`, `logout.ts`, `me.ts` | Auth endpoints |
| `profile.ts` | User/agency profile (GET/POST) |
| `google.ts` | Google OAuth2 flow |
| `send-email.ts` | Send via Gmail (primary) or SMTP (fallback) |
| `smtp-settings.ts` | SMTP credential management |
| `leads/index.ts` | List and create leads |
| `leads/[id].ts` | Update and delete specific lead |
| `stripe/create-checkout-session.ts` | Initiate Stripe checkout |
| `stripe/webhook.ts` | Handle Stripe subscription events |

### Authentication

All API routes validate the Supabase JWT from the `Authorization: Bearer` header using the Supabase admin client (`SUPABASE_SERVICE_ROLE_KEY`). The token is extracted and used to identify the user for all database operations.

### Email Sending

`api/send-email.ts` tries Gmail first (if user connected Google OAuth), then falls back to user-configured SMTP. SMTP passwords are stored AES-256-CBC encrypted; `ENCRYPTION_KEY` must be exactly 32 characters.

### Key Data Types

- `Lead` — a business prospect with fields for audit content, outreach copy, action plan, status
- `UserProfile` — the agency owner's business info used to personalize AI-generated content
- `Business` — raw result from Gemini business search

## Environment Variables

See `.env.example` for the full list. Critical ones:

```
GEMINI_API_KEY
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
STRIPE_SECRET_KEY, VITE_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
ENCRYPTION_KEY   # exactly 32 characters
APP_URL, VITE_APP_URL
```

`VITE_*` variables are bundled into the frontend by Vite; non-prefixed variables are server-only.
