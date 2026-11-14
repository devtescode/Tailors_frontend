# Style by Zahra — Design & Build Brief

This document is the shared design contract for the storefront and atelier dashboard.

## Brand

- **Name:** Style by Zahra
- **Tagline:** Premium fashion, crafted for you.
- **Location:** Osogbo, Osun State, Nigeria
- **WhatsApp:** 08169406539 · international +234 816 940 6539
- **Ordering:** WhatsApp only — no cart, checkout or payment flow
- **Delivery:** Nationwide across Nigeria

Voice: elegant, warm, confident and personal. Short sentences. No hype, no invented awards and no placeholder contact details.

All business details live in `src/lib/config/site.ts`. Do not duplicate the WhatsApp number or location in components.

## Stack

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Radix + Framer Motion + React Router + TanStack React Query v5.

Do not add dependencies without a clear reason.

## Colour tokens

Defined in `src/index.css` and exposed through `tailwind.config.ts`.

| Token | Value | Usage |
| --- | --- | --- |
| `burgundy` | `#720D2C` | primary surfaces, CTAs, links |
| `burgundy-deep` | `#430817` | footer, hover, dramatic panels |
| `cream` | `#FFF7EF` | page background |
| `gold` | `#C18A32` | accents, rules, highlights |
| `charcoal` / `ink` | `#25191C` | headings and body |
| `white` | `#FFFFFF` | cards and admin surfaces |

Use white cards on cream, burgundy for emphasis and gold for fine accents. Avoid rainbow gradients, glassmorphism and oversized rounded cards.

## Typography

- `font-display` = **Playfair Display** — headings, wordmark, numbers.
- `font-body` = **DM Sans** — body copy, navigation, buttons and forms.
- `font-script` = **Parisienne** — short decorative signatures only.
- Italic Playfair for one emphasised word in a heading.
- Eyebrows use `.eyebrow` with a fine gold rule.
- Body copy: `text-[0.98rem] sm:text-base leading-relaxed text-muted-foreground`.

## Shared primitives

- `src/components/brand/Logo.tsx` — monogram + wordmark; `variant="dark" | "light"`, `compact`.
- `src/components/brand/SectionHeading.tsx` — eyebrow, heading, description; `tone`, `align`.
- `src/components/brand/WhatsAppButton.tsx` — always opens WhatsApp.
- `src/lib/config/site.ts` — business configuration, navigation, WhatsApp builders and `formatNaira`.
- `src/lib/images.ts` — product image resolution and editorial fallbacks.
- `src/components/admin/AdminLayout.tsx` — shared authenticated chrome.
- `src/components/admin/ProductFormDialog.tsx` — create/edit product dialog.
- `src/components/auth/ProtectedRoute.tsx` — admin route guard.

Buttons: `.btn-primary`, `.btn-champagne`, `.btn-outline`, `.btn-light-outline`, `.btn-quiet`. Pill-shaped, uppercase, minimum 44px touch targets.

Forms: `.admin-field` for boxed admin inputs; visible labels, hints and errors. Inputs remain 16px on mobile.

## Layout

- Container: `container mx-auto` with responsive padding.
- Section rhythm: `py-20 sm:py-24 lg:py-32`.
- Square-ish corners (`rounded-sm` at most), 1px borders and restrained shadows.
- Images: `object-cover`, `overflow-hidden`, subtle hover scale. Always include dimensions or an aspect ratio to prevent layout shift. Hero images load eagerly; everything else lazy-loads.
- No horizontal overflow at 320px. Check navigation, tables, dashboard actions and long product names.

## Motion

Use Framer Motion sparingly with a 0.6–0.7s ease and small 12–28px offsets. Stagger lists by 60–90ms. No bouncing, spinning or parallax.

`MotionConfig reducedMotion="user"` is configured globally, and `prefers-reduced-motion` is respected in CSS.

## Accessibility

- One `<h1>` per page.
- Sections use `aria-labelledby`.
- Icon-only controls have `aria-label`.
- Filters use `aria-pressed`; dialogs use Radix focus management and titles.
- Focus states use the global gold ring; never remove outlines.
- Decorative imagery is hidden from assistive technology; product imagery has descriptive alt text.
- Mobile navigation closes on Escape and outside click, locks body scroll and returns focus.
- Contrast targets WCAG AA: ink or muted ink on cream; cream on burgundy.

## Content rules

- Product cards and preview dialogs order through WhatsApp only.
- Prices are formatted with `formatNaira` (`en-NG`, NGN, no decimals).
- Collection filters are All, Men and Women.
- The homepage order is Hero → Collection → Why Choose Us → How It Works → About → Testimonials → Contact.
- Admin screens are lazy-loaded and protected.
- No customer accounts, cart, checkout or payment data.

## Server state

All server reads and writes use TanStack React Query:

- `useProducts`, `useAddProducts`, `useEditProduct`, `useDeleteProduct`
- `useAdminStatus`, `useAdminLogin`, `useAdminRegister`, `useChangePassword`

Never call `fetch` from a component and never fetch in `useEffect`. Add endpoints to `src/lib/api/` and hooks to `src/lib/queries/`.
