import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import Logo from "@/components/brand/Logo";
import { GENERAL_WHATSAPP_LINK, NAV_LINKS, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (headerRef.current && target && !headerRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-burgundy text-cream">
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <p className="min-w-0 truncate text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-cream/85 sm:text-[0.62rem]">
            {site.tagline}
            <span className="hidden md:inline"> · Nationwide delivery from Osogbo</span>
          </p>

          <a
            href={GENERAL_WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-cream transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light sm:text-[0.64rem]"
          >
            <FaWhatsapp aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chat on WhatsApp ·</span>
            <span>{site.whatsapp.display}</span>
          </a>
        </div>
      </div>

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border/80 bg-cream/95 shadow-[0_16px_40px_-34px_hsl(var(--ink)/0.55)] backdrop-blur-xl"
            : "border-transparent bg-cream",
        )}
      >
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <Logo onClick={closeMobile} showTagline={!scrolled} />

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-8">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative py-2 font-body text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={GENERAL_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary hidden md:inline-flex"
              aria-label={`Book an order on WhatsApp, ${site.whatsapp.display}`}
            >
              <FaWhatsapp aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="hidden xl:inline">Book on WhatsApp</span>
              <span className="xl:hidden">WhatsApp</span>
              <span className="hidden border-l border-cream/25 pl-2 text-cream/75 xl:inline">
                {site.whatsapp.display}
              </span>
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-ink transition-colors hover:border-burgundy/40 hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
            >
              {mobileOpen ? (
                <X aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-border/70 bg-cream lg:hidden"
            >
              <nav
                aria-label="Mobile"
                className="container mx-auto flex max-h-[calc(100vh-9rem)] flex-col gap-1 overflow-y-auto px-4 py-4 sm:px-6"
              >
                {NAV_LINKS.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="flex items-center justify-between border-b border-border/60 py-3.5 font-display text-lg text-ink transition-colors hover:text-burgundy"
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className="font-body text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold-ink"
                    >
                      0{index + 1}
                    </span>
                  </a>
                ))}

                <a
                  href={GENERAL_WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="btn-primary mt-4 w-full"
                >
                  <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
                  Chat on WhatsApp · {site.whatsapp.display}
                </a>

                <p className="pt-3 text-center font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted-foreground">
                  {site.location.full}
                </p>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
