# Flyback INSIGHTS — Frontend

A modern editorial web application for **Flyback Electronics** built with React 19, Vite, and Tailwind CSS 4. The app delivers tech deep-dives, trend analysis, and long-form articles through a sleek, dark glassmorphism-inspired UI.

---

## ✨ Features

- **Multi-page SPA** — Home, Topics, Deep Dives, Analysis, Article reader, About, and Contact pages routed via React Router v7
- **Article Slugs** — SEO-friendly, human-readable URLs generated from article titles (e.g. `/article/the-silicon-brain-a-deep-dive-into-ai-accelerators`)
- **Component library** — Reusable node cards (`HeroNode`, `StandardNode`, `TrendNode`) for different article display formats
- **Glassmorphism design system** — `glass-panel` utility class + backdrop blur, gradients, and dark-mode palette throughout
- **Sticky glass Navbar** — Navigation with search and mobile hamburger support
- **Newsletter / Subscribe flow** — `NewsletterSync` component integrated in the layout
- **Storybook** — Component development and documentation environment included

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev) |
| Build tool | [Vite 7](https://vite.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Routing | [React Router DOM v7](https://reactrouter.com) |
| Component docs | [Storybook 10](https://storybook.js.org) |
| Testing | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev) |
| Linting | [ESLint 10](https://eslint.org) |

---

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── canvas/          # Canvas / background effects
│   │   ├── layout/
│   │   │   ├── Layout.jsx       # Root layout wrapper
│   │   │   ├── Navbar.jsx       # Sticky glass header
│   │   │   ├── Footer.jsx       # Footer with legal links & social icons
│   │   │   └── NewsletterSync.jsx
│   │   ├── nodes/
│   │   │   ├── HeroNode.jsx     # Full-width hero article card
│   │   │   ├── StandardNode.jsx # Standard article card
│   │   │   └── TrendNode.jsx    # Trending / compact article card
│   │   ├── sections/        # Page sections
│   │   └── ui/              # Generic UI primitives
│   ├── constants/           # Shared data constants
│   ├── hooks/               # Custom React hooks
│   ├── lib/
│   │   └── slugify.js       # URL slug utility
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Topics.jsx
│   │   ├── DeepDives.jsx
│   │   ├── Analysis.jsx
│   │   ├── ArticlePage.jsx  # Dynamic article reader (/article/:slug)
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── stories/             # Storybook stories
│   ├── App.jsx              # Root router
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles & design tokens
├── .storybook/              # Storybook configuration
├── design/                  # Design references / mockups
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** with Hot Module Replacement (HMR) enabled.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production (output to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run storybook` | Launch Storybook on port 6006 |
| `npm run build-storybook` | Build a static Storybook export |

---

## 🔗 Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/topics` | Topics |
| `/DeepDives` | Deep Dives |
| `/Analysis` | Analysis |
| `/article/:slug` | Article reader |
| `/about` | About |
| `/contact` | Contact / Subscribe |

---

## 🧩 Key Utilities

### `slugify(text)` — `src/lib/slugify.js`

Converts article titles into URL-safe slugs:

```js
import { slugify } from './lib/slugify'

slugify('The Silicon Brain: A Deep Dive into AI Accelerators')
// → 'the-silicon-brain-a-deep-dive-into-ai-accelerators'
```

---

## 🎨 Design System

The UI is built around a dark glassmorphism aesthetic:

- **`glass-panel`** — reusable backdrop-blur card style
- **`font-display`** — display heading font family
- **`bg-primary` / `text-primary`** — branded accent colour (blue)
- **`background-dark`** — deep dark background base
- Tailwind CSS 4 custom properties defined in `src/index.css`

---

## 📖 Storybook

Component stories live in `src/stories/`. To browse them:

```bash
npm run storybook
```

Open **http://localhost:6006** in your browser.

---

## 📄 License

© Flyback INSIGHTS. All rights reserved.
