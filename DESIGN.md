# Style by Zahra — Design & Build Brief

This file is the shared contract for every contributor/agent. Read it fully before writing code.

## Brand

- **Name:** Style by Zahra
- **Tagline:** Elegance in Every Stitch.
- **Support:** Beautifully crafted outfits, tailored to fit your style.
- **Location:** Osogbo, Osun State, Nigeria.
- **WhatsApp:** 0816 940 6539 / international 2348169406539.
- **Business:** one tailor sewing clothes for clients. No perfumes, jewellery, accessories, retail products, carts or checkout. Ever.

Voice: elegant, feminine, sophisticated, premium, creative, professional, trustworthy. Short sentences. No hype, no invented statistics, no fake testimonials, no fake years of experience.

## Stack (do not change)

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Framer Motion + React Router. Existing REST API at `https://tailors-backend.onrender.com` via `src/lib/api.ts`. Do not add dependencies.

## Colour tokens (see `src/index.css` and `tailwind.config.ts`)

| Token | Value | Usage |
| --- | --- | --- |
| `burgundy` | #64134F | primary surfaces, CTAs |
| `burgundy-deep` | darker burgundy | hover, footer |
| `champagne` | #D8B77A | lines, accents, eyebrow rules |
| `champagne.ink` / `gold-ink` | #8A6A32-ish | small text on cream |
| `cream` | #FFF9F4 | page background |
| `rose` | #EAD8DF | soft section background |
| `rose-light` | very pale rose | form panels |
| `ink` | #241B24 | headings and body |
| `ink-soft` | muted ink | body copy |

Use white cards on cream, burgundy for drama, rose for a quiet breath between sections. No rainbow gradients, no glassmorphism, no heavy drop shadows, no giant rounded cards.

## Typography

- `font-display` = Playfair Display. Headings, wordmark, numbers.
- `font-body` = DM Sans. Body, UI, buttons.
- Headings: `text-[2.15rem] sm:text-[2.8rem] lg:text-[3.35rem] leading-[1.08] tracking-[-0.02em]`, balanced.
- Eyebrows: use `.eyebrow` (uppercase 0.7rem, tracking 0.32em) with a champagne rule.
- Italic Playfair for a single emphasised word, e.g. `<em className="italic text-burgundy">Stitch.</em>` or `text-champagne` on dark.
- Body copy: `text-[0.98rem] sm:text-base leading-relaxed text-muted-foreground`.
- Never lowercase headings. Never use emoji in headings.

## Shared primitives — use these, don't duplicate

- `src/components/brand/Logo.tsx` — wordmark, `variant="dark" | "light"`.
- `src/components/brand/SectionHeading.tsx` — eyebrow + h2 + description, `tone`, `align`.
- `src/components/brand/WhatsAppButton.tsx` — always opens WhatsApp; variants `primary | champagne | outline | light-outline | quiet`.
- `src/lib/site.ts` — `site`, `NAV_LINKS`, `buildEnquiryMessage`, `whatsappLink`, `serviceEnquiryLink`, `GENERAL_WHATSAPP_LINK`, `SERVICE_OPTIONS`.
- `src/data/content.ts` — `services`, `differentiators`, `processSteps`, `portfolioSamples`, `portfolioFilters`, `testimonials`, `contactChannels`, `heroImage`, `aboutImage`, `editorialImages`.
- `src/lib/images.ts` — `getProductImage`, `resolveImageUrl`, `getFallbackImage`.
- `src/lib/api.ts` — API client. Never invent endpoints.

Buttons: prefer `.btn-primary`, `.btn-outline`, `.btn-champagne`, `.btn-light-outline`, `.btn-quiet` or `WhatsAppButton`. Buttons are pill-shaped, 0.72–0.76rem uppercase, tracking 0.18em. Minimum touch target 44px.

Forms: `.field` (underline inputs on cream) or `.admin-field` (boxed on admin). Labels always visible. Inputs must stay 16px on mobile (global CSS handles it; do not add `text-sm` to inputs on mobile).

## Layout

- Container: `container mx-auto` with responsive padding from the Tailwind config.
- Section rhythm: `py-20 sm:py-24 lg:py-32`. Generous whitespace.
- Cards: square-ish corners (`rounded-sm` max; no `rounded-3xl`), 1px borders (`border-border`), white or cream surfaces.
- Image treatment: `object-cover`, `overflow-hidden`, subtle hover `scale-[1.03]` over 700ms. Add width/height or aspect ratio to prevent layout shift. Hero image `loading="eager" fetchPriority="high"`; all others `loading="lazy" decoding="async"`.
- Decorative gold hairlines and small ornaments are welcome. Avoid blobs/glow circles and emoji ornaments.
- No horizontal overflow at 320px. Test long words and the WhatsApp button.

## Motion

Use Framer Motion sparingly and elegantly:

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
>
```

Stagger children by 60–90ms. No bouncing, spinning or parallax gimmicks. Respect `MotionConfig reducedMotion="user"` (already global).

## Accessibility

- One `<h1>` per page (Hero on home).
- Sections use `aria-labelledby` pointing at their heading id.
- Buttons have text or `aria-label`. Icon-only buttons have `aria-label`.
- Filters use `aria-pressed`. Modals use shadcn `Dialog` with `DialogTitle`.
- Focus states use the global champagne ring; never remove outlines.
- Decorative images/icons get `alt=""` / `aria-hidden="true"`.
- Mobile menu closes on Escape and click, locks body scroll, returns focus to the toggle.
- Colour contrast: body text is `ink`/`ink-soft` on cream; never champagne body text on cream. On burgundy, use cream.

## Honesty rules

- Portfolio samples from `portfolioSamples` are explicitly labelled **"Design inspiration"**. Never present them as past client work.
- Testimonials list is empty. Render the designed empty state; do not invent names, quotes or ratings.
- No invented "years of experience", "happy clients", awards, delivery promises or opening hours.
- Service inquiry links must use `serviceEnquiryLink(service.title)` so the WhatsApp message includes the service name.

## File ownership for this build

| Owner | Files |
| --- | --- |
| Foundation (already written) | `index.css`, `tailwind.config.ts`, `index.html`, `lib/*`, `data/content.ts`, `components/brand/*`, `public/*` |
| Layout agent | `components/layout/AnnouncementBar.tsx`, `Navbar.tsx`, `Footer.tsx`, `FloatingWhatsApp.tsx` |
| Hero agent | `sections/Hero.tsx` |
| Services agent | `sections/Services.tsx` |
| Portfolio agent | `sections/Portfolio.tsx` |
| Values agent | `sections/WhyChoose.tsx`, `sections/Process.tsx` |
| About agent | `sections/About.tsx`, `sections/Testimonials.tsx` |
| Contact agent | `sections/Contact.tsx` |
| Admin core agent | `pages/AdminDashboard.tsx`, `components/admin/AdminShell.tsx` |
| Admin access agent | `pages/AdminLogin.tsx`, `pages/AdminChangePassword.tsx`, `pages/NotFound.tsx` |
| Integration (lead) | `pages/Index.tsx`, `App.tsx`, `README.md` |

Do not edit files outside your ownership. Do not edit shared tokens, `tailwind.config.ts`, `index.css`, `index.html`, `lib/*`, `data/content.ts` or `components/brand/*`. If something is missing, note it in your final response instead of changing shared files.
