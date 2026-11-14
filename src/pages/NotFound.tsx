import { Link } from "react-router-dom";
import { ArrowUpRight, Home, MessageCircle } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { GENERAL_WHATSAPP_LINK } from "@/lib/site";

/**
 * Branded 404. Keeps the editorial cream/burgundy/gold language of the
 * storefront and offers two clear ways forward: home, or the atelier on WhatsApp.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-cream">
      <span aria-hidden="true" className="gold-line absolute inset-x-0 top-0 h-px" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 hidden border border-border/60 sm:block lg:inset-6"
      />

      <header className="relative container mx-auto flex w-full items-center justify-between gap-3 px-4 py-5 sm:px-6 sm:py-6">
        <Logo showTagline={false} />
        <p className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:block">
          Osogbo · Osun State
        </p>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 pb-16 pt-6 sm:px-6 sm:pb-20">
        <div className="w-full max-w-2xl text-center">
          <p className="eyebrow justify-center">
            <span aria-hidden="true" className="h-px w-7 bg-champagne" />
            Error 404 — Page not found
          </p>

          <div className="mt-6 flex flex-col items-center">
            <span
              aria-hidden="true"
              className="font-display text-[4.25rem] leading-none tracking-[-0.04em] text-burgundy sm:text-[5.5rem]"
            >
              404
            </span>
            <span aria-hidden="true" className="gold-line mt-4 h-px w-24 sm:w-32" />
          </div>

          <h1 className="mx-auto mt-7 max-w-xl font-display text-[2rem] leading-[1.1] tracking-tight text-ink sm:text-[2.9rem]">
            This page has
            <span className="mt-1 block font-script text-[2.25rem] leading-[1.15] text-burgundy sm:text-[3.4rem]">
              slipped a stitch.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            The address you followed does not lead to one of our pieces. Let us guide you back to
            the atelier, or send a message and we will help you find exactly what you need.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link to="/" className="btn-primary w-full sm:w-auto">
              <Home aria-hidden="true" className="h-4 w-4" />
              Back to home
            </Link>

            <a
              href={GENERAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full sm:w-auto"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Chat on WhatsApp
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>

          <p className="mt-7 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
            WhatsApp · 08169406539
          </p>
        </div>
      </main>

      <footer className="relative border-t border-border/60 py-6">
        <p className="container mx-auto px-4 text-center text-[0.66rem] uppercase tracking-[0.22em] text-muted-foreground sm:px-6">
          Style by Zahra · Premium fashion, crafted for you.
        </p>
      </footer>
    </div>
  );
}
