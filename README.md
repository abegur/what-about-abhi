# what-about-abhi

A personal portfolio website built with AI as a collaborator — part learning experiment, part product showcase.

This project was built to serve a dual purpose: showcase my background as a software engineer and demonstrate product thinking. Rather than using a template, I worked with Claude (Anthropic's AI) to design and build the entire site from scratch, treating it as a real product with a real user (you).

The full story behind why this exists is on the [What Is This?](/app/what-is-this/page.tsx) page of the site.

> **Hosting:** Domain purchase pending. Will be live soon.

---

## Pages

| Page | Description |
|------|-------------|
| `/` | Home — hero, "Currently" widget, and bio |
| `/experience` | Work history and education timeline |
| `/projects` | Selected personal and professional projects |
| `/hobbies` | A few things I do outside of work |
| `/travel` | Countries visited and wishlist map |
| `/what-is-this` | The honest story behind why this site exists |

---

## Tech Stack

| Technology | Role |
|------------|------|
| [Next.js](https://nextjs.org) | Framework — App Router, server components |
| [TypeScript](https://www.typescriptlang.org) | Type safety across the codebase |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling with a custom warm dark theme |
| [Framer Motion](https://www.framer.com/motion/) | Animations and scroll-triggered effects |
| [React Leaflet](https://react-leaflet.js.org) | Interactive travel map |
| [Claude AI](https://www.anthropic.com) | AI collaborator for design, code, and copy |
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
  what-is-this/page.tsx # Meta page
components/
  home/                 # Hero, Currently widget
  experience/           # Timeline
  projects/             # Project cards
  travel/               # Leaflet map
lib/
  data.ts               # All site content lives here
```

---

## Updating Content

All content (experience, projects, hobbies, travel, currently widget) is managed from a single file: **`lib/data.ts`**. No need to touch any component files for routine content updates.
