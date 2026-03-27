# Feature Spec — abhibegur.com

A personal portfolio website built to demonstrate product thinking and engineering depth. Designed and shipped as a real product, with real analytics, interactive components, and hidden easter eggs.

**Live at:** [abhibegur.com](https://abhibegur.com)

---

## Pages

| Path | Name | Purpose |
|------|------|---------|
| `/` | Home | Hero, "Currently" live snapshot widget, and bio with page links |
| `/experience` | Experience | Work history and education timeline |
| `/projects` | Projects | Selected personal and professional projects |
| `/hobbies` | Hobbies | Things outside of work |
| `/travel` | Travel | Interactive map of countries visited and wishlist |
| `/insights` | Insights | Public analytics summary with narrative insight cards |
| `/what-is-this` | What Is This? | The story behind the portfolio and how it was built |
| `/dashboard` | Dashboard | Private analytics dashboard (password-protected) |

---

## Home Page

### Hero Section
- Full-viewport intro with animated name entrance
- Pulsing status dot indicating "open to opportunities"
- Animated scroll nudge arrow with breathing effect
- 3-second name hover triggers the easter egg (see Easter Eggs)

### Currently Widget
- Live snapshot of what the owner is reading, building, listening to, and watching
- Rows with emoji icons, label, and value
- Staggered entrance animation on scroll into view
- Content managed via `lib/data.ts`

### About Section
- Short bio with quick navigation links to Experience, Projects, Hobbies, and Travel

---

## Navigation

### Sticky Navbar
- Fixed top bar that gains a glass-blur background after scrolling past 20px
- Active route highlighted via `usePathname()`
- Desktop: horizontal link list with a Contact button
- Mobile: hamburger icon that expands to a full slide-down menu with animated icon morph

### Contact Modal
- Opens from the Contact button in the navbar (desktop and mobile)
- Displays email, LinkedIn, and city
- Closes on backdrop click or Escape key
- Rendered above all page content including the Leaflet map (z-index 9999)

### Nav Click Tracking
- Every nav link click and Contact button tap fires a `nav_click` event with the destination recorded

---

## Projects Page

### Project Cards
- Each card shows year, title, short description, and up to 3 skill tags
- On hover (desktop): a terracotta overlay slides up from the bottom revealing the full description and a "View" link
- On tap (mobile): tapping a card toggles the overlay open; tap again to close. All links inside are fully tappable.
- Some projects have a secondary link (e.g., GitHub alongside a live demo)

---

## Travel Page

### Interactive Map
- Dark CartoDB basemap via React Leaflet (no API key required)
- Two pin types:
  - Visited: solid terracotta circle with cream ring
  - Wishlist: dashed cream outline
- Hover popups on each pin showing country name
- Scroll-wheel zoom disabled to prevent page interference; drag and pinch-zoom work normally
- Rendered client-side only (SSR-safe dynamic import)

---

## Analytics System

### Event Tracking

All events are fire-and-forget (never block UX). Tracked via a custom `track()` function in `lib/analytics.ts` that POSTs to `/api/track`, which inserts into Supabase.

| Event | Trigger |
|-------|---------|
| `page_view` | Every page mount |
| `page_exit` | Navigating away (includes seconds spent on page) |
| `nav_click` | Any nav link or Contact button click |
| `contact_open` | Contact modal opens |
| `scroll_depth` | At 25%, 50%, 75%, and 100% scroll on the home page |
| `section_view` | Hero, Currently, and About sections enter the viewport |
| `easter_egg` | Any hidden easter egg is triggered |
| `what_is_this_visit` | The /what-is-this page is loaded |

### Session Filtering
- Sessions under 5 seconds are excluded from all dashboard metrics to filter out bots and accidental hits

### Pause Tracking
- The dashboard has a "Pause Tracking" toggle so the owner's own interactions are not recorded
- State persists across tabs and refreshes via `localStorage`
- Can also be toggled from the browser console on any page

### Private Dashboard (`/dashboard`)

Password-protected. Client-side password wall backed by `sessionStorage`; API calls also require the password in a request header.

Features:
- **KPI cards:** total page views, unique sessions, top page, avg time on site, total easter eggs found, egg discovery rate
- **Page views chart:** line chart of daily views over the last 30 days
- **Views by page chart:** horizontal bar chart ranked by page
- **Scroll depth chart:** bar chart showing how far visitors scroll on the home page
- **Easter egg stat cards:** individual discovery counts per egg
- **Nav click heatmap:** ranked list of which nav links get clicked most
- **Recent sessions table:** last 50 sessions with timestamps, pages visited, and event count
- **AI Insights panel:** Anthropic Claude-generated narrative insight cards, cached in Supabase, with a Regenerate button

### Public Insights (`/insights`)

Visible to all visitors. No login required.

- KPI summary row: visitors this month, most popular page, total easter eggs found
- Up to 5 narrative insight cards generated from live analytics data
- Privacy note: no personal information is collected
- Last updated timestamp

---

## Easter Eggs

| Type | Trigger | Difficulty |
|------|---------|------------|
| `hover_name_trick` | Hover over the name in the hero for 3 seconds | Medium |
| `hidden_dot` | Click the hidden dot in the bottom-right corner | Hard |
| `bottom_message` | Scroll all the way to the footer | Easy |

---

## Content Management

All site content lives in a single file: `lib/data.ts`. No component files need to be touched for routine updates.

Managed from `lib/data.ts`:
- Experience entries (title, company, period, location, description, type)
- Skills (languages, tools, industry knowledge)
- Project entries (title, year, short and long descriptions, tags, status, links)
- Hobby entries
- Travel data (countries visited, wishlist)
- Currently widget rows (emoji, label, value)

---

## Infrastructure

| Technology | Role |
|------------|------|
| Next.js | Framework (App Router, server components) |
| TypeScript | Type safety across the codebase |
| Tailwind CSS | Utility-first styling with a custom warm dark theme |
| Framer Motion | All animations and scroll-triggered effects |
| React Leaflet | Interactive travel map |
| Supabase | Analytics database (`page_events` table) |
| Recharts | Charts in the private analytics dashboard |
| Claude AI | AI collaborator for design, code, and AI insights |
| Vercel | Deployment and edge hosting |
