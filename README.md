# Style by Zahra

> **Premium fashion, crafted for you.**
>
> A bespoke fashion storefront and private atelier dashboard for **Style by Zahra**, Osogbo, Osun State, Nigeria.

Customers browse the live collection, preview each piece and order directly on WhatsApp. The atelier owner signs in to a protected dashboard to add, edit and remove products, upload photography and keep pricing current. There is **no cart, checkout or payment flow** — every order starts as a WhatsApp conversation.

---

## Business information

| Detail | Value |
| --- | --- |
| Brand | Style by Zahra |
| Tagline | Premium fashion, crafted for you. |
| Location | Osogbo, Osun State, Nigeria |
| WhatsApp (local) | 08169406539 |
| WhatsApp (international) | +234 816 940 6539 |
| WhatsApp link | https://wa.me/2348169406539 |
| Ordering | WhatsApp only |
| Delivery | Nationwide across Nigeria |

All brand and contact details live in one file: [`src/lib/config/site.ts`](src/lib/config/site.ts). Change the WhatsApp number, location, hours or social handles there and every page follows.

---

## Storefront

- **Announcement bar** with the tagline and a live WhatsApp number.
- **Sticky navbar** with Collection, Our Process, About, Testimonials and Contact links, plus a functional mobile menu and WhatsApp CTA.
- **Hero** — “Style by Zahra. Dress with Confidence.” with credibility stats and two clear actions.
- **Collection** — All / Men / Women filters, premium product cards, Naira formatting, image preview dialog, loading skeletons, empty state, error state and retry.
- **Why Choose Us** — Bespoke Designs, Premium Fabrics, Expert Craftsmanship, Perfect Fit, Nationwide Delivery and Dedicated Customer Support.
- **How It Works** — Chat with us, Share your measurements, We craft your outfit, Receive your outfit.
- **About** — atelier story, values and craftsmanship statistics.
- **Testimonials** — client stories and ratings.
- **Contact** — direct WhatsApp panel, atelier location, studio hours and social links.
- **Footer** — navigation, contact details, social links and admin entry.
- **Branded 404** and a global error boundary.

## Admin

- **Split-screen sign-in** with first-admin bootstrap (registration is only offered when the backend reports no admin yet).
- **Dashboard** with collection statistics, searchable and category-filtered table, pagination, mobile product cards, loading skeletons, empty/error states and refresh.
- **Product management** — single or batch creation, edit dialog, delete confirmation, image upload with preview and validation.
- **Change password** with current-password verification, validation and success feedback.
- **Protected routes** powered by the session token and a centralised 401 handler.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| UI | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui primitives, Radix UI |
| Motion | Framer Motion |
| Server state | TanStack React Query v5 |
| Routing | React Router v6 |
| Forms | Native React forms with shared validation |
| Icons | Lucide React, React Icons |
| Notifications | shadcn toast |
| Tests | Vitest |

---

## Architecture

```
src/
├── assets/                 Editorial imagery
├── components/
│   ├── admin/              AdminLayout, ProductFormDialog
│   ├── auth/               ProtectedRoute
│   ├── brand/              Logo, SectionHeading, WhatsAppButton
│   ├── ui/                 shadcn/ui primitives
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── ProductSection.tsx
│   ├── WhyChooseUs.tsx
│   ├── HowItWorks.tsx
│   ├── AboutSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── ContactSection.tsx
│   └── Footer.tsx
├── hooks/                  Toast and responsive helpers
├── lib/
│   ├── api/
│   │   ├── client.ts       Fetch, JWT, timeout, 401 handling, ApiError
│   │   ├── products.api.ts Product endpoints + normalisation
│   │   └── admin.api.ts    Auth and password endpoints
│   ├── config/site.ts      Single source of business truth
│   ├── queries/
│   │   ├── query-keys.ts   Central query keys
│   │   ├── products.queries.ts
│   │   └── admin.queries.ts
│   ├── images.ts           Image URL resolution and fallbacks
│   ├── site.ts             Backwards-compatible re-export
│   └── types.ts            Domain types
├── pages/
│   ├── Index.tsx
│   ├── AdminLogin.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminChangePassword.tsx
│   └── NotFound.tsx
├── App.tsx                 QueryClient, providers, lazy routes
└── index.css               Brand tokens, base styles, utilities
```

### React Query

Every server read and write goes through TanStack React Query. There is no component-level `fetch` and no `useEffect` data fetching.

| Hook | Purpose |
| --- | --- |
| `useProducts()` | Public and admin product list |
| `useAddProducts()` | Create one or many products |
| `useEditProduct()` | Update a product |
| `useDeleteProduct()` | Delete with optimistic removal |
| `useAdminStatus()` | Detect whether the first admin exists |
| `useAdminLogin()` | Sign in and persist the JWT |
| `useAdminRegister()` | Create the first admin, then refresh status |
| `useChangePassword()` | Update the admin password |

The shared `QueryClient` is configured in `src/App.tsx` with sane stale times, one retry for queries and no retries for mutations.

---

## Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Storefront |
| `/admin` | Public | Sign in or first-admin setup |
| `/admin/dashboard` | Protected | Product dashboard |
| `/admin/change-password` | Protected | Update password |
| `*` | Public | Branded 404 |

Admin pages are lazy-loaded and wrapped in `ProtectedRoute`.

---

## API contract

The frontend expects a REST API with the following endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/products/getallproducts` | List products |
| `POST` | `/products/addproducts` | Create a product (`multipart/form-data`) |
| `PUT` | `/products/editproducts/:id` | Update a product (`multipart/form-data`) |
| `DELETE` | `/products/deleteproducts/:id` | Delete a product |
| `GET` | `/admin/status` | Returns `{ adminExists: boolean }` |
| `POST` | `/admin/register` | Create the first admin |
| `POST` | `/admin/login` | Returns `{ token }` |
| `PUT` | `/admin/changepassword` | Change the current admin password |

Product fields: `name`, `price`, `description`, optional `category` (`Men` / `Women`) and optional image file. The API may return `_id` or `id`; the client normalises both to a single `CatalogItem` shape.

### Authentication

- The JWT is stored in `sessionStorage` under `token`.
- `src/lib/api/client.ts` attaches the Bearer token and clears the session on a 401.
- A protected-route event (`sz:unauthorized`) redirects the user back to `/admin`.
- Signing out clears the token immediately.
- No demo credentials or plaintext credential helpers exist in the codebase.

---

## Getting started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app runs at `http://localhost:8080` by default.

### Environment

The API base URL defaults to `https://tailors-backend.onrender.com`. Override it with a Vite environment variable:

```bash
# .env
VITE_API_URL=https://your-api.example.com
```

See [`.env.example`](.env.example).

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript project check |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

### First admin

1. Open `/admin`.
2. If the backend reports that no admin exists, the page switches to **first-time setup**.
3. Create the administrator account.
4. Sign in with those credentials.
5. Use **Change password** from the dashboard whenever needed.

Once an admin exists, the setup form is no longer offered.

---

## Design system

| Token | Value |
| --- | --- |
| Burgundy | `#720D2C` |
| Deep burgundy | `#430817` |
| Cream | `#FFF7EF` |
| Gold | `#C18A32` |
| Charcoal | `#25191C` |
| White | `#FFFFFF` |

- **Headings:** Playfair Display
- **Body:** DM Sans
- **Decorative script:** Parisienne
- Editorial spacing, fine gold rules, framed imagery and restrained motion.

The palette and typography are defined as CSS variables in `src/index.css` and exposed through Tailwind in `tailwind.config.ts`.

---

## Responsive and accessibility

- Layouts are designed from 320px upward, with deliberate checks at 375, 425, 768, 1024, 1440 and large screens.
- Semantic landmarks, one `h1` per page, descriptive alt text and keyboard-accessible controls.
- Visible `focus-visible` rings on interactive elements.
- WCAG AA contrast targets for body copy and actions.
- `prefers-reduced-motion` disables transitions and scroll animation.
- Admin dialogs use Radix focus management; destructive actions require confirmation.
- Form fields expose labels, hints, errors and busy states.

---

## Deployment

The project builds to static files and is ready for Vercel or any static host.

```bash
npm run build
```

Set `VITE_API_URL` in the hosting environment if the backend is not the default. Because the app uses client-side routing, configure the host to rewrite unknown routes to `index.html` (Vercel does this automatically for Vite SPAs).

---

## Notes

- Orders are completed on WhatsApp: **08169406539**.
- No card data, cart or checkout is handled by this application.
- The admin dashboard is a catalogue manager, not an order-management system.
