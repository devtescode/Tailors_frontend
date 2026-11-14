import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

import Logo from "@/components/brand/Logo";
import { NAV_LINKS, site } from "@/lib/site";

const socialIcons: Record<string, JSX.Element> = {
  Instagram: <FaInstagram aria-hidden="true" className="h-4 w-4" />,
  Facebook: <FaFacebook aria-hidden="true" className="h-4 w-4" />,
  TikTok: <FaTiktok aria-hidden="true" className="h-4 w-4" />,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-burgundy-deep text-cream">
      <div className="container mx-auto px-4 pb-8 pt-16 sm:px-6 sm:pt-20">
        <div className="grid gap-10 border-b border-cream/15 pb-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo variant="light" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/70">
              {site.supporting}
            </p>
            <p className="mt-5 font-script text-2xl leading-none text-gold-light">
              Crafted for you.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className="lg:col-span-2">
            <h2 className="font-body text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold-light">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-cream/70 transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-deep"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="font-body text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold-light">
              Visit &amp; order
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-cream/70">
              <li>
                <a
                  href={site.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cream"
                >
                  WhatsApp · {site.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-cream"
                >
                  {site.location.full}
                </a>
              </li>
              <li>{site.hours}</li>
            </ul>
          </div>

          {/* Social */}
          <div className="lg:col-span-3">
            <h2 className="font-body text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold-light">
              Follow the atelier
            </h2>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Style by Zahra on ${social.label}`}
                  className="inline-flex h-11 w-11 items-center justify-center border border-cream/20 text-cream/80 transition-colors hover:border-gold-light hover:bg-cream/5 hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-deep"
                >
                  {socialIcons[social.label] ?? social.label.slice(0, 1)}
                </a>
              ))}
            </div>
            <p className="mt-5 max-w-[15rem] text-xs leading-relaxed text-cream/55">
              New pieces, studio moments and styling notes from Osogbo.
            </p>
          </div>
        </div>

        {/* <div className="flex flex-col gap-4 pt-7 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[0.66rem] uppercase tracking-[0.2em] text-cream/50">
            © {year} Style by Zahra. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.62rem] uppercase tracking-[0.18em] text-cream/50 sm:justify-end">
            <span>Crafted in Osogbo, Osun State</span>
            <Link
              to="/admin"
              className="transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-burgundy-deep"
            >
              Admin
            </Link>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
