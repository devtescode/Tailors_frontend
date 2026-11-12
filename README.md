# TailorCraft

> **Premium bespoke tailoring, stitched to perfection.**
>
> A React + TypeScript storefront for a Nigerian bespoke tailoring atelier. Customers browse a live collection and order directly through WhatsApp; the owner manages the catalog from a token-protected admin dashboard.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix-000000)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Routes](#routes)
- [API integration](#api-integration)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Admin access](#admin-access)
- [Project structure](#project-structure)
- [Design system](#design-system)
- [Data model](#data-model)
- [Testing & quality](#testing--quality)
- [Deployment](#deployment)
- [Customization checklist](#customization-checklist)
- [Security notes](#security-notes)
- [Accessibility notes](#accessibility-notes)
- [Performance notes](#performance-notes)
- [Known limitations & roadmap](#known-limitations--roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

TailorCraft is a single-page application for a bespoke African fashion atelier. It pairs a marketing site (hero, collection, process, about, testimonials, contact) with a lightweight admin back office. Product data lives in an external REST API; there is **no cart, checkout, or payment flow** — every product links to a pre-filled WhatsApp message so the tailor can close the sale conversationally.

The visual identity is warm and editorial: a cream/charcoal palette with gold accents, Playfair Display headings, DM Sans body copy, and scroll-reveal animations.

**Audience:** fashion clients ordering bespoke outfits for weddings and events, plus the atelier owner managing the catalog.

**Not included:** customer accounts, analytics, search, payments, inventory levels, and order tracking.

---

## Features

### Storefront (`/`)

- **Fixed, responsive navbar** — transparent-to-blurred on scroll, mobile dropdown, anchor navigation, and an Admin entry point.
- **Full-screen hero** — animated headline, gold underline, dual CTAs, and three credibility stats.
- **Live product catalog** — fetched from the backend on mount, with:
  - **All / Men / Women** category filters.
  - Responsive cards showing image, category badge, name, two-line description, and ₦ price.
  - Hover overlay that opens a larger image preview in a dialog.
  - **Order via WhatsApp** with a pre-filled message containing the product name and price.
- **Why Choose Us** — six trust/value cards (bespoke designs, premium fabrics, on-time delivery, fit guarantee, nationwide shipping, support).
- **How It Works** — four-step process: Chat → Share measurements → We craft → Receive.
- **About** — brand story, four feature cards, atelier portrait, and a "5+ years" badge.
- **Testimonials** — six customer stories with five-star ratings.
- **Contact** — phone, email, studio address, working hours, and a WhatsApp inquiry CTA.
- **Footer** — brand blurb, in-page quick links, and social links.
- **404 page** — catch-all route with a return-home link.

### Admin

Reachable from `/admin`. Features include:

- **First-run bootstrap** — checks whether an admin exists; if not, the form creates the first admin account. Otherwise it signs in.
- **JWT session** — token stored in `sessionStorage` and sent as `Authorization: Bearer <token>`.
- **Dashboard** (`/admin/dashboard`):
  - Product inventory table with image, name, category badge, ₦ price, and row actions.
  - Loading, empty, and populated states.
  - **Batch add** — add multiple product rows in a single submit.
  - **Edit** — inline edit modal with current image preview.
  - **Delete** — confirmation via SweetAlert2.
  - **Image upload** — click-to-upload file picker with live preview (`multipart/form-data`).
  - Responsive header with a mobile menu (View Site, Change Password, Logout).
- **Change password** (`/admin/change-password`) — current/new/confirm fields, visibility toggles for the current and new password, minimum six characters, and confirmation matching.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 + TypeScript 5.8 |
| Build tool | Vite 5.4 (`@vitejs/plugin-react-swc`) |
| Routing | React Router DOM 6.30 (`BrowserRouter`) |
| Styling | Tailwind CSS 3.4 + `tailwindcss-animate` |
| UI foundation | shadcn/ui (Radix UI primitives + CVA) |
| Animation | Framer Motion 12 |
| Icons | Lucide React, React Icons |
| Forms / validation | React Hook Form + Zod + `@hookform/resolvers` *(installed; native forms used today)* |
| Data fetching | Native `fetch`; TanStack Query provider mounted but unused |
| Notifications | Radix toast (`useToast`) + SweetAlert2; Sonner is mounted but unused |
| Testing | Vitest 3 + Testing Library + jsdom |
| Linting | ESLint 9 flat config + typescript-eslint |
| Deployment | Vercel (static SPA with rewrite) |

---

## Architecture

This repository contains the **frontend only**. All persistence and authentication are handled by an external backend at `https://tailors-backend.onrender.com`.

```text
Browser
  │
  ├── "/" ──────────────► Index.tsx (landing page)
  │                         └── ProductSection ──► GET /products/getallproducts
  │                                              └── WhatsApp deep link (wa.me)
  │
  └── "/admin*" ────────► Admin pages
                            ├── GET  /admin/status
                            ├── POST /admin/register | /admin/login
                            ├── PUT  /admin/changepassword
                            └── CRUD /products/*   (Bearer token, multipart)
                                        │
                                        ▼
                      https://tailors-backend.onrender.com
```

**Key architectural notes**

- **No global state library.** Pages use local `useState` / `useEffect`.
- **No API client layer.** `fetch` calls and the backend origin are duplicated across pages.
- **Two data sources exist.** `src/lib/store.ts` is a legacy `localStorage` demo store (seeded products + local admin helpers) that the live UI no longer uses; only `WHATSAPP_NUMBER` and `getWhatsAppLink()` are actually used (plus two unused imports in `AdminChangePassword.tsx`). The real catalog comes from the API.
- **Providers** (`src/App.tsx`): TanStack Query → Tooltip → Toasters → `BrowserRouter`.
- **No route guards.** The dashboard and change-password pages check for a token inside effects and redirect if missing; the server must enforce authorization.

---

## Routes

| Path | Component | Purpose |
|---|---|---|
| `/` | `src/pages/Index.tsx` | Public landing page |
| `/admin` | `src/pages/AdminLogin.tsx` | Admin registration / login |
| `/admin/dashboard` | `src/pages/AdminDashboard.tsx` | Product management |
| `/admin/change-password` | `src/pages/AdminChangePassword.tsx` | Update admin password |
| `*` | `src/pages/NotFound.tsx` | 404 fallback |

`vercel.json` rewrites every path to `index.html`, so direct navigation to admin routes works on Vercel.

---

## API integration

All requests target `https://tailors-backend.onrender.com` (hardcoded in four files).

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| `GET` | `/admin/status` | None | Returns `{ adminExists }` |
| `POST` | `/admin/register` | None | Creates the first admin (`{ email, password }`) |
| `POST` | `/admin/login` | None | Returns `{ token }` |
| `PUT` | `/admin/changepassword` | Bearer | Body `{ currentPassword, newPassword }` |
| `GET` | `/products/getallproducts` | None (Bearer optional) | Returns an array of products |
| `POST` | `/products/addproducts` | Bearer | `multipart/form-data` with optional `image` |
| `PUT` | `/products/editproducts/:id` | Bearer | `multipart/form-data`; `:id` is the Mongo `_id` |
| `DELETE` | `/products/deleteproducts/:id` | Bearer | Deletes by `_id` |

**Expected product shape**

```json
{
  "_id": "6650f1c2a9b3c4d5e6f78901",
  "name": "Royal Agbada Set",
  "price": 85000,
  "description": "Premium hand-embroidered Agbada…",
  "imageURL": "https://res.cloudinary.com/…/agbada.jpg",
  "category": "Men"
}
```

> The backend must allow CORS from the deployed frontend origin and accept image uploads. There is no logout endpoint; the client simply deletes the token. The API is hosted on Render, where idle instances may cold-start, so the first request after a period of inactivity can be slow.

---

## Getting started

### Prerequisites

- **Node.js 18+** (Node 20 LTS recommended — Vite 5 requirement)
- **npm** (a `package-lock.json` is committed)
- Access to the backend API (the hosted Render instance works out of the box)

### Installation

```bash
git clone <your-repository-url>
cd tailor-s-showcase-main
npm install
```

### Development

```bash
npm run dev
```

The Vite dev server binds to `::` on **port 8080**:

```text
http://localhost:8080
```

HMR is enabled; the React Fast Refresh error overlay is disabled in `vite.config.ts`.

### Production build

```bash
npm run build
```

Output is written to `dist/`. Preview the production bundle locally with:

```bash
npm run preview
```

### Notes on package managers

The repo currently contains `package-lock.json`, `bun.lock`, and `bun.lockb`. Pick one package manager and remove the other lockfiles to avoid dependency drift.

---

## Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `vite` | Start dev server on port 8080 |
| `npm run build` | `vite build` | Production build to `dist/` |
| `npm run build:dev` | `vite build --mode development` | Development-mode build |
| `npm run preview` | `vite preview` | Serve the built app locally |
| `npm run lint` | `eslint .` | Lint the repository |
| `npm test` | `vitest run` | Run the test suite once |
| `npm run test:watch` | `vitest` | Run tests in watch mode |

---

## Configuration

### Backend URL

The API origin is currently hardcoded in:

- `src/components/ProductSection.tsx`
- `src/pages/AdminLogin.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/pages/AdminChangePassword.tsx`

Before deploying to a new environment, extract it into an environment variable:

```bash
# .env.example (recommended)
VITE_API_URL=https://tailors-backend.onrender.com
```

```ts
// src/lib/api.ts (recommended)
export const API_URL = import.meta.env.VITE_API_URL ?? "https://tailors-backend.onrender.com";
```

> This wiring is **not implemented yet**; the example shows the recommended refactor.

### Brand/contact values

These placeholders must be replaced before going live:

| Value | Location |
|---|---|
| WhatsApp number `2348012345678` | `src/lib/store.ts` (`WHATSAPP_NUMBER`) |
| Phone `+234 801 234 5678` | `src/components/ContactSection.tsx` |
| Email `hello@tailorcraft.ng` | `src/components/ContactSection.tsx` |
| Address `12 Bode Thomas St, Surulere, Lagos` | `src/components/ContactSection.tsx` |
| Working hours | `src/components/ContactSection.tsx` |
| Social handles `@tailorcraft` | `src/components/Footer.tsx` |
| Brand name / stats | `Navbar`, `HeroSection`, `AboutSection`, `Footer`, `index.html` |

### Admin defaults

`src/lib/store.ts` still contains a legacy local-auth demo:

```text
email:    admin@tailor.com
password: admin123
```

These credentials are **not used** by the current admin pages (which authenticate against the backend), but the code remains bundled. Remove it and never deploy with a default password.

---

## Admin access

1. Make sure the backend is reachable.
2. Open `/admin`.
   - If no admin exists, the form switches to **Create Admin** and calls `POST /admin/register`.
   - Otherwise it signs in via `POST /admin/login`.
3. After creating the first admin, sign in again (registration does not log you in automatically).
4. The returned token is stored in `sessionStorage` under `token`; closing the tab ends the session.
5. Manage products at `/admin/dashboard`.
6. Change the password at `/admin/change-password` (minimum 6 characters).

> **Important:** registration is open whenever `GET /admin/status` reports that no admin exists. Create the first admin immediately after deployment (or gate registration on the server).

---

## Project structure

```text
tailor-s-showcase-main/
├── public/
│   └── robots.txt
├── src/
│   ├── assets/                     # hero-bg, about-tailor, product-1…6 (JPEG)
│   ├── components/
│   │   ├── ui/                     # shadcn/ui primitives (Radix)
│   │   ├── Navbar.tsx
│   │   ├── NavLink.tsx             # route-aware link wrapper (currently unused)
│   │   ├── HeroSection.tsx
│   │   ├── ProductSection.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── AboutSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── use-toast.ts            # Radix toast store
│   │   └── use-mobile.tsx          # <768px breakpoint hook
│   ├── lib/
│   │   ├── types.ts                # Product, AdminCredentials
│   │   ├── images.ts               # bundled image map + fallback
│   │   ├── store.ts                # legacy demo store, auth, WhatsApp helpers
│   │   └── utils.ts                # cn() = clsx + tailwind-merge
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminChangePassword.tsx
│   │   └── NotFound.tsx
│   ├── test/
│   │   ├── setup.ts
│   │   └── example.test.ts
│   ├── App.tsx                     # providers + routes
│   ├── main.tsx                    # React entry
│   ├── index.css                   # Tailwind + design tokens
│   └── vite-env.d.ts
├── index.html                      # metadata, fonts, mount point
├── eslint.config.js
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
├── vitest.config.ts
├── vercel.json
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── package.json
```

---

## Design system

### Color palette

Tokens are HSL CSS variables in `src/index.css` and are exposed through Tailwind.

| Token | HSL | Role |
|---|---|---|
| `--gold` | `38 60% 55%` | Primary accent |
| `--gold-light` | `38 50% 75%` | Gradient highlight |
| `--cream` | `40 33% 96%` | Background |
| `--cream-dark` | `35 25% 90%` | Secondary surfaces |
| `--charcoal` | `30 10% 15%` | Foreground / dark sections |
| `--charcoal-light` | `30 8% 35%` | Muted text |
| `--radius` | `0.5rem` | Base corner radius |

Semantic shadcn tokens (`background`, `foreground`, `card`, `muted`, `border`, `ring`, …) map onto the same variables. A `.dark` palette is defined in CSS but **no theme toggle is wired** — the app is light-only.

### Typography

- **Playfair Display** — `font-display`, applied automatically to all headings.
- **DM Sans** — `font-body`, applied to the document body.
- Loaded from Google Fonts via `@import` in `src/index.css`.

### Utilities & animation

- `.text-gradient-gold` — gold gradient clipped to text (used in section headings).
- Tailwind keyframes: `fade-up`, `accordion-down`, `accordion-up`.
- Framer Motion `whileInView` reveals throughout the landing page; `tailwindcss-animate` backs Radix animations.
- Reusable primitives live in `src/components/ui/` (shadcn/ui). Only a few are reachable from app code: `dialog` (product preview), `tooltip` (provider), and the toast stack (`toast`/`toaster`, plus the mounted-but-unused `sonner`). Everything else — including `button`, `input`, `label`, and `sheet` — is referenced only by other unused primitives.

---

## Data model

```ts
// src/lib/types.ts
interface Product {
  _id: string;          // MongoDB identifier
  name: string;
  price: number;
  description: string;
  imageURL: string;
  category?: string;    // "Men" | "Women" in practice
}

interface AdminCredentials {
  email: string;
  password: string;
}
```

> **Known inconsistency:** `src/lib/store.ts` and the admin form use `id` while the API and `types.ts` use `_id`. This is hidden by the relaxed TypeScript config and causes the local image fallback (keyed `"1"`–`"6"`) never to match backend ObjectIds. Unify on `_id` (or map explicitly) when refactoring.

Images are resolved by `getProductImage(id, imageURL)`:

1. If `imageURL` starts with `http`, use it.
2. Otherwise look up the bundled `product-1…6.jpg` map.
3. Fall back to `product-1.jpg`.

---

## Testing & quality

```bash
npm test          # Vitest, run once
npm run test:watch
npm run lint
```

- Vitest uses the **jsdom** environment, `globals: true`, and `src/test/setup.ts` (jest-dom + a `matchMedia` stub).
- The suite currently contains **one placeholder smoke test** (`src/test/example.test.ts`); there are no component or integration tests yet.
- Test discovery: `src/**/*.{test,spec}.{ts,tsx}`. `@testing-library/user-event` is not installed, and there is no coverage config or CI workflow.

**Current project health**

| Check | Status |
|---|---|
| `npm run build` | ✅ Passes (emits a single ~612 kB JS chunk warning) |
| `npx tsc --noEmit -p tsconfig.app.json` | ❌ 9 errors (mostly `id` vs `_id`, `File` assigned to `img src`) |
| `npm run lint` | ❌ 8 errors / 8 warnings (`no-explicit-any`, empty interfaces, `require()` in Tailwind config) |
| `npm test` | ✅ Passes (placeholder only) |

`npm run build` runs `vite build` only — esbuild strips types without checking them. To enforce types, add:

```json
"typecheck": "tsc --noEmit -p tsconfig.app.json"
```

and consider making the build `tsc -b && vite build`. TypeScript is currently configured with `strict: false`, `noImplicitAny: false`, and `noUnusedLocals: false`.

---

## Deployment

### Vercel

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Use the detected **Vite** preset:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install` (or `npm ci`)
4. No environment variables are required today because the API URL is hardcoded. Add `VITE_API_URL` if you complete the env refactor.
5. `vercel.json` rewrites `/(.*)` to `/index.html`, which is required for the admin routes.

### Other static hosts

Any static host works (Netlify, Cloudflare Pages, GitHub Pages with a base path) as long as:

- The build output is `dist/`.
- All unknown paths fall back to `index.html`.
- The backend allows requests from the deployed origin (CORS).
- For subpath hosting (e.g. GitHub Pages), set Vite's `base` option accordingly.

---

## Customization checklist

Use this list to rebrand the site:

- [ ] Replace the WhatsApp number in `src/lib/store.ts` (`WHATSAPP_NUMBER`).
- [ ] Update phone, email, address, map link, and hours in `ContactSection.tsx`.
- [ ] Update Instagram / Facebook / X / TikTok URLs in `Footer.tsx`.
- [ ] Rename the brand in `Navbar`, `HeroSection`, `AboutSection`, `Footer`, the admin header, and `index.html`.
- [ ] Replace hero, about, and product images in `src/assets/` (keep filenames or update imports).
- [ ] Update the marketing stats (500+ clients, 15+ years, 1000+ designs) — note the About card currently says 5+.
- [ ] Replace the six static testimonials with real, permissioned quotes.
- [ ] Point the four hardcoded API URLs at your backend (ideally via `VITE_API_URL`).
- [ ] Set `index.html` title/description and add `og:image`, `twitter:image`, and a favicon.
- [ ] Delete the legacy demo store/credentials from `src/lib/store.ts` if unused.
- [ ] Pick one lockfile and remove the others.
- [ ] Add a `LICENSE` file if the project will be distributed.

---

## Security notes

> This is a frontend-only app; **all real authorization must be enforced by the backend**.

- **Admin bootstrap is public.** If no admin exists, anyone who reaches `/admin` can create one. Seed the first admin server-side or protect registration with a one-time secret.
- **JWT in `sessionStorage`.** The token is readable by any XSS; it is cleared on tab close but never validated client-side (expiry, role) and there is no auto-logout. Prefer short-lived tokens plus refresh, or httpOnly cookies.
- **Client-side route checks are not security.** `/admin/dashboard` only verifies that *some* token string exists.
- **Legacy default credentials** (`admin@tailor.com` / `admin123`) remain in `src/lib/store.ts`, alongside helpers that would persist credentials in plaintext in `localStorage`. Remove this dead code and rotate any password that was ever used.
- **Upload validation is advisory.** The UI says "PNG, JPG up to 5MB" but does not enforce type or size. Validate MIME type, magic bytes, and size on the server.
- **Image URLs** are accepted whenever they start with `http` (including plain `http://`). Allow-list trusted hosts and require HTTPS.
- **Security headers are not configured.** Add CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, and `Permissions-Policy` in `vercel.json`.
- **CORS** on the backend should be restricted to known frontend origins.

---

## Accessibility notes

The site has good foundations (semantic buttons/links, alt text, Radix dialog focus handling), but the following should be addressed:

- **Contrast:** small muted text (`--muted-foreground`, 3.58:1) and gold text (2.22:1) fail WCAG AA on cream. Use `--foreground` for body copy and reserve gold for large display text or dark surfaces.
- **Keyboard access:** the product preview trigger is a `<div onClick>` with no role, tab index, or key handler. Use a `<button aria-label="Preview …">`.
- **Admin modal:** the add/edit panel is a plain positioned `<div>`; rebuild it with `components/ui/dialog.tsx` to get focus trapping, Escape, and an accessible name.
- **Zoom:** `index.html` sets `maximum-scale=1.0, user-scalable=no`. Remove these to allow pinch-zoom.
- **Reduced motion:** wrap the app in `<MotionConfig reducedMotion="user">` and honor `prefers-reduced-motion`.
- **Labels & errors:** associate `<label>`/`<input>` with `htmlFor`/`id`; give inline errors `role="alert"` and `aria-invalid`/`aria-describedby`.
- **Icon-only buttons:** add `aria-label` to dashboard actions, password visibility toggles, upload controls, and social links (the mobile menu also needs `aria-expanded`/`aria-controls`).
- **Landmarks:** add a `<main>` wrapper and a skip-to-content link.

---

## Performance notes

- The production build emits a **single ~612 kB JS chunk (~190 kB gzip)** plus ~74 kB CSS. All routes are statically imported, so admin code and SweetAlert2 are shipped to every visitor. Lazy-load `/admin/*` (`React.lazy` + `Suspense`) to keep the storefront lean.
- `framer-motion`, `recharts`, `embla-carousel-react`, `cmdk`, `vaul`, and many Radix packages are installed; most wrappers are unused. Prune dependencies you do not plan to use.
- Images are unoptimized JPEGs (~786 kB total; hero ~201 kB at 1920×1080, about ~216 kB). Serve responsive `srcset`/WebP/AVIF and add `fetchpriority="high"` and a preload hint to the hero image.
- Google Fonts are loaded via a render-blocking CSS `@import`. Prefer `<link rel="preconnect">` + `<link rel="stylesheet">` in `index.html`, or self-host the fonts.
- Add `sitemap.xml`, a favicon, a web manifest, and social preview images; `robots.txt` currently has no `Sitemap:` directive.
- Inactive code (`App.css`, `NavLink.tsx`, 43 of the 48 `ui/` files, legacy store) adds repository noise but is tree-shaken out of the bundle.

---

## Known limitations & roadmap

- [ ] Move the API base URL, WhatsApp number, and contact details into environment/config modules.
- [ ] Add a shared API client with `res.ok` checks, timeouts, retries, and consistent error handling.
- [ ] Add an error/empty state and retry button to the product catalog; handle backend cold starts.
- [ ] Add a `ProtectedRoute` component and centralize 401 handling/logout.
- [ ] Enforce upload type/size validation and revoke unused object URLs.
- [ ] Unify `id` / `_id` naming and fix the 9 TypeScript errors; enable `strict` and make the build type-check.
- [ ] Fix the 8 ESLint errors and re-enable `no-unused-vars`.
- [ ] Replace the placeholder test with real component/API tests and add CI.
- [ ] Add form validation, password strength rules, and a success redirect after password change.
- [ ] Replace fictional testimonials/stats with verified content (and reconcile "5+" vs "15+" years).
- [ ] Add real favicon, OG/Twitter images, `sitemap.xml`, and structured data (`LocalBusiness`).
- [ ] Add a light/dark theme toggle or remove the unused `.dark` palette.
- [ ] Prune unused shadcn/ui components and dependencies.
- [ ] Add a `LICENSE`.

---

## Contributing

1. Create a feature branch.
2. Make focused changes that follow the existing structure and naming.
3. Run the checks before opening a pull request:

   ```bash
   npm run lint
   npx tsc --noEmit -p tsconfig.app.json
   npm test
   npm run build
   ```

4. Describe the user-facing change and include screenshots for UI updates.

> At the time of writing, `lint` and `tsc` fail (see [Testing & quality](#testing--quality)); treat those as cleanup work rather than assuming the checks are green.

> The `master` branch is the current default. Commit messages in the existing history are generic ("update code") — prefer descriptive messages.

---

## License

No license file is included in this repository. Until a license is added, treat the code as **all rights reserved** and do not redistribute it. If this is an open-source project, add a `LICENSE` file (MIT is a common default) and update this section.

---

## Acknowledgements

- Scaffolded with [Lovable](https://lovable.dev/) (`lovable-tagger`).
- UI components generated with [shadcn/ui](https://ui.shadcn.com/) on top of [Radix UI](https://www.radix-ui.com/).
- Styling by [Tailwind CSS](https://tailwindcss.com/); animation by [Framer Motion](https://www.framer.com/motion/).
- Icons from [Lucide](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/).
- Alerts by [SweetAlert2](https://sweetalert2.github.io/).
- Fonts: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) and [DM Sans](https://fonts.google.com/specimen/DM+Sans).
- Product data and authentication served by the external `tailors-backend` API.
    