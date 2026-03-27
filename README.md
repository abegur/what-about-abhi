# what-about-abhi

A personal portfolio website built with AI as a collaborator — part learning experiment, part product showcase.

This project was built to serve a dual purpose: showcase my background as a software engineer and demonstrate product thinking. Rather than using a template, I worked with Claude (Anthropic's AI) to design and build the entire site from scratch, treating it as a real product with a real user (you).

The full story behind why this exists is on the [What Is This?](/app/what-is-this/page.tsx) page of the site.

> **Live at:** [abhibegur.com](https://abhibegur.com)

---

## Pages

| Page | Description |
|------|-------------|
| `/` | Home — hero, "Currently" widget, and bio |
| `/experience` | Work history and education timeline |
| `/projects` | Selected personal and professional projects |
| `/hobbies` | A few things I do outside of work |
| `/travel` | Countries visited and wishlist map |
| `/insights` | Public analytics summary — PM-style narrative report |
| `/what-is-this` | The honest story behind why this site exists |
| `/dashboard` | Private analytics dashboard (password-protected) |

---

## Tech Stack

| Technology | Role |
|------------|------|
| [Next.js](https://nextjs.org) | Framework — App Router, server components |
| [TypeScript](https://www.typescriptlang.org) | Type safety across the codebase |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling with a custom warm dark theme |
| [Framer Motion](https://www.framer.com/motion/) | Animations and scroll-triggered effects |
| [React Leaflet](https://react-leaflet.js.org) | Interactive travel map |
| [Supabase](https://supabase.com) | Analytics database (page_events table) |
| [Recharts](https://recharts.org) | Charts in the private analytics dashboard |
| [Claude AI](https://www.anthropic.com) | AI collaborator for design, code, and AI insights |
| [Vercel](https://vercel.com) | Deployment and edge hosting |

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Project Structure

```
app/
  page.tsx              # Home
  experience/page.tsx   # Experience timeline
  projects/page.tsx     # Projects grid
  hobbies/page.tsx      # Hobbies
  travel/page.tsx       # Travel map
  insights/page.tsx     # Public analytics narrative
  dashboard/page.tsx    # Private analytics dashboard
  what-is-this/page.tsx # Meta page
  api/
    track/route.ts      # POST: write analytics events to Supabase
    analytics/route.ts  # GET: aggregate events (protected)
    insights/route.ts   # GET/POST: AI-generated insights cache
components/
  home/                 # Hero, Currently widget
  experience/           # Timeline
  projects/             # Project cards
  travel/               # Leaflet map
  dashboard/            # KPI cards, charts, session table
  AnalyticsProvider.tsx # Mounts page view tracking in layout
hooks/
  usePageView.ts        # Fires page_view / page_exit events
  useScrollDepth.ts     # Fires scroll_depth at 25/50/75/100%
lib/
  data.ts               # All site content lives here
  analytics.ts          # track() — fire-and-forget event client
  supabase.ts           # Supabase client instances
  insightsHelpers.ts    # Generates InsightCard[] from AnalyticsData
types/
  analytics.ts          # Shared TypeScript interfaces
scripts/
  setup-supabase.ts     # DB connectivity check + setup instructions
```

---

## Analytics System

The site has a custom analytics pipeline that captures real visitor behavior without any third-party tracking tools.

### Architecture

```
Browser
  └─ lib/analytics.ts: track(event_name, page_path, metadata)
       └─ fire-and-forget POST → /api/track
            └─ supabaseAdmin.insert() → Supabase: page_events table

/api/analytics (GET, password-protected)
  └─ fetches + aggregates page_events
  └─ consumed by /dashboard and /insights

/api/insights (GET/POST, password-protected)
  └─ reads/writes ai_insights_cache table
  └─ POST calls Anthropic Claude API to generate insight cards
```

### Events Tracked

| Event | When |
|-------|------|
| `page_view` | On every page mount |
| `page_exit` | When navigating away (includes time spent) |
| `nav_click` | Every nav link and Contact button click |
| `contact_open` | When the contact modal opens |
| `scroll_depth` | At 25/50/75/100% scroll on the home page |
| `section_view` | When hero/currently/about sections enter viewport |
| `easter_egg` | When a hidden easter egg is triggered |
| `what_is_this_visit` | When /what-is-this is loaded |

### Database Schema

```sql
CREATE TABLE page_events (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name   TEXT        NOT NULL,
  page_path    TEXT        NOT NULL,
  session_id   TEXT        NOT NULL,
  metadata     JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Indexes on: created_at, event_name, session_id
```

### Setup

1. Copy `.env.example` to `.env.local` and fill in all values
2. Get your Supabase service role key from: Dashboard → Settings → API
3. Run the setup script to verify connectivity and get the CREATE TABLE SQL:
   ```bash
   npx ts-node --project tsconfig.node.json scripts/setup-supabase.ts
   ```
4. Paste the printed SQL into the [Supabase SQL editor](https://supabase.com/dashboard/project/_/sql)

### Accessing the Dashboard

Navigate to `/dashboard` and enter the password from `DASHBOARD_PASSWORD` in your environment.

### Pausing Tracking

To stop your own interactions from being recorded (e.g. while reviewing the dashboard), click **"Pause Tracking"** in the dashboard header. The button turns terracotta to indicate tracking is off. Click **"Resume Tracking"** to re-enable it.

The paused state persists across tabs and page refreshes via `localStorage`. You can also toggle it from the browser console on any page:

```js
localStorage.setItem('ab_tracking_paused', 'true')   // pause
localStorage.setItem('ab_tracking_paused', 'false')  // resume
```

---

## Updating Content

All content (experience, projects, hobbies, travel, currently widget) is managed from a single file: **`lib/data.ts`**. No need to touch any component files for routine content updates.
