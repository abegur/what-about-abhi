# Feature Spec — abhibegur.com

A personal portfolio website for Abhi Begur. Built to demonstrate product thinking and engineering depth, with real analytics, interactive components, and hidden easter eggs.

---

## Pages

| Path | Name | Purpose |
|------|------|---------|
| `/` | Home | Hero section, "Currently" status widget, and bio |
| `/experience` | Experience | Work history and education timeline |
| `/projects` | Projects | Selected personal and professional projects (with hover overlay) |
| `/hobbies` | Hobbies | Things outside of work |
| `/travel` | Travel | Interactive Leaflet map of countries visited and wishlist |
| `/insights` | Insights | Public analytics summary with PM-style narrative cards |
| `/what-is-this` | What Is This? | The story behind the portfolio and how it was built |
| `/dashboard` | Dashboard | Private analytics dashboard (password-protected) |

---

## Analytics System

### Event Tracking

All events are fire-and-forget via `lib/analytics.ts`. Tracking can be paused via the dashboard toggle (persisted in `localStorage`).

| Event | Trigger |
|-------|---------|
| `page_view` | Every page mount |
| `page_exit` | Navigation away (includes time spent in seconds) |
| `nav_click` | Every nav link and Contact button click |
| `contact_open` | Contact modal opens |
| `scroll_depth` | At 25/50/75/100% scroll on the home page |
| `section_view` | Hero, Currently, and About sections entering viewport |
| `easter_egg` | Any hidden easter egg triggered |
| `what_is_this_visit` | `/what-is-this` page loaded |

### Session Filtering

Sessions shorter than 5 seconds are excluded from all dashboard metrics to filter out bots and accidental hits.

### Private Dashboard (`/dashboard`)

Password-protected (client-side form + server-side API header check). Features:

- KPI cards: total views, unique sessions, top page, avg time on site, eggs found, egg discovery rate
- Page views line chart (last 30 days)
- Page breakdown bar chart (views by path)
- Scroll depth bar chart (home page, at 25/50/75/100%)
- Easter egg discovery stat cards
- Nav click heatmap (ranked list)
- Recent sessions table (last 50 sessions)
- AI Insights panel (Anthropic Claude API, regenerate button)

**Pause tracking:** Dashboard header has a toggle to pause/resume event collection for the owner's own sessions.

### Public Insights (`/insights`)

Visible to all visitors. Shows:

- KPI summary row (total views, unique sessions, top page)
- Up to 5 narrative insight cards generated from live analytics data

### AI Insights (Stretch Goal)

Accessible from the dashboard. Calls the Anthropic Claude API to generate insight cards from raw analytics data. Results are cached in the `ai_insights_cache` Supabase table. A "Regenerate" button triggers a fresh generation.

---

## Easter Eggs

| Type | Trigger |
|------|---------|
| `hover_name_trick` | Hover over the name in the hero section for 3 seconds |
| `hidden_dot` | Click the hidden dot in the bottom-right corner of any page |
| `bottom_message` | Scroll all the way to the footer to reveal the bottom message |

---

## Project Cards (Mobile)

Project cards on `/projects` use a hover overlay to reveal the long description and links. On touch devices, tapping a card toggles the overlay open/closed (tap again to close). Links inside the overlay are fully tappable on mobile.

---

## Content Management

All site content lives in `lib/data.ts`:

- Experience entries (timeline)
- Project entries (cards)
- Hobby entries
- Travel data (countries visited, wishlist)
- Currently widget content

No component files need to be touched for routine content updates.

---

## Infrastructure

| Technology | Role |
|------------|------|
| Next.js | Framework (App Router, server components) |
| TypeScript | Type safety across the codebase |
| Tailwind CSS | Utility-first styling with a custom warm dark theme |
| Framer Motion | Animations and scroll-triggered effects |
| React Leaflet | Interactive travel map |
| Supabase | Analytics database (`page_events` table) |
| Recharts | Charts in the private analytics dashboard |
| Claude AI | AI collaborator for design, code, and AI insights |
| Vercel | Deployment and edge hosting |
