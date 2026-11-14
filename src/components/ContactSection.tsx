import { motion, type Variants } from "framer-motion";
import {
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import type { IconType } from "react-icons";

import SectionHeading from "@/components/brand/SectionHeading";
import WhatsAppButton from "@/components/brand/WhatsAppButton";
import {
  GENERAL_WHATSAPP_LINK,
  buildEnquiryMessage,
  site,
  whatsappLink,
} from "@/lib/site";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const enquiryLink = whatsappLink(buildEnquiryMessage());

type ContactCard = {
  label: string;
  value: string;
  caption: string;
  icon: IconType;
  href?: string;
  ariaLabel?: string;
};

const contactCards: ContactCard[] = [
  {
    label: "WhatsApp",
    value: site.whatsapp.display,
    caption: "Message us directly — the quickest way to reach the atelier.",
    icon: FaWhatsapp,
    href: GENERAL_WHATSAPP_LINK,
    ariaLabel: `Message Style by Zahra on WhatsApp at ${site.whatsapp.display}`,
  },
  {
    label: "The atelier",
    value: site.location.full,
    caption: "Private fittings in Osogbo, with delivery nationwide.",
    icon: FaMapMarkerAlt,
    href: site.mapsUrl,
    ariaLabel: `View the Style by Zahra atelier location, ${site.location.full}, on Google Maps`,
  },
  {
    label: "Studio hours",
    value: site.hours,
    caption: "Message ahead so we can set aside time for you.",
    icon: FaClock,
  },
];

const socialIcons: Record<string, IconType> = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  TikTok: FaTiktok,
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-cream py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-16 h-80 w-80 rounded-full bg-champagne/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-24 h-72 w-72 rounded-full bg-rose/50 blur-3xl"
      />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            align="center"
            title={
              <>
                Let's create something{" "}
                <em className="italic text-burgundy">beautiful.</em>
              </>
            }
            description="Tell us the occasion and the feeling you want to carry into the room. We will look after the fabric, the fit and every last stitch."
          />
        </motion.div>

        {/* Primary WhatsApp panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          className="relative mt-12 overflow-hidden rounded-sm bg-burgundy-deep text-cream shadow-lift sm:mt-14"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute -right-24 -top-28 h-80 w-80 rounded-full border border-champagne/20" />
            <span className="absolute -right-10 -top-14 h-56 w-56 rounded-full border border-champagne/15" />
            <span className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-burgundy/70 blur-2xl" />
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />
          </div>

          <div className="relative grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-12 lg:items-center lg:gap-12 lg:px-14 lg:py-14">
            <div className="lg:col-span-7">
              <span className="eyebrow text-champagne">
                <span aria-hidden="true" className="h-px w-8 bg-champagne/70" />
                WhatsApp — direct
              </span>

              <h3 className="mt-5 max-w-lg font-display text-[1.85rem] leading-[1.12] text-cream sm:text-[2.3rem] lg:text-[2.5rem]">
                The quickest way to reach us is a{" "}
                <em className="italic text-champagne">message.</em>
              </h3>

              <p className="mt-4 max-w-md text-[0.94rem] leading-relaxed text-cream/70">
                Share your occasion, your date and any inspiration you love.
                Zahra will guide you through fabric, fit and finish — and a
                timeline that works for you.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <WhatsAppButton
                  href={enquiryLink}
                  variant="champagne"
                  className="w-full sm:w-auto"
                  ariaLabel={`Chat with Style by Zahra on WhatsApp at ${site.whatsapp.display}`}
                >
                  Chat on WhatsApp
                </WhatsAppButton>

                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open the Style by Zahra location, ${site.location.full}, in Google Maps`}
                  className="btn-light-outline w-full sm:w-auto"
                >
                  Find the atelier
                </a>
              </div>

              <p className="mt-5 font-body text-[0.62rem] uppercase tracking-[0.18em] text-cream/50">
                We typically respond within a few hours.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="flex h-full flex-col justify-between gap-8 border border-cream/20 bg-cream/[0.04] p-6 sm:p-7">
                <div>
                  <p className="font-body text-[0.56rem] font-semibold uppercase tracking-[0.26em] text-champagne/80">
                    Direct line
                  </p>
                  <a
                    href={GENERAL_WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Message Style by Zahra on WhatsApp at ${site.whatsapp.display}`}
                    className="mt-3 block font-display text-[1.5rem] leading-none tracking-[0.02em] text-cream transition-colors duration-300 hover:text-champagne sm:text-[1.8rem] lg:text-[1.9rem]"
                  >
                    {site.whatsapp.display}
                  </a>
                  <p className="mt-3 text-[0.82rem] leading-relaxed text-cream/60">
                    Tap to open WhatsApp, or save the number for your next
                    fitting.
                  </p>
                </div>

                <dl className="grid gap-4 border-t border-cream/15 pt-5">
                  <div>
                    <dt className="font-body text-[0.54rem] uppercase tracking-[0.24em] text-champagne/70">
                      Atelier
                    </dt>
                    <dd className="mt-1 text-[0.84rem] leading-relaxed text-cream/80">
                      {site.location.full}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-body text-[0.54rem] uppercase tracking-[0.24em] text-champagne/70">
                      Hours
                    </dt>
                    <dd className="mt-1 text-[0.84rem] leading-relaxed text-cream/80">
                      {site.hours}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detail cards */}
        <motion.ul
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-6 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contactCards.map(({ label, value, caption, icon: Icon, href, ariaLabel }) => (
            <motion.li key={label} variants={cardVariants} className="h-full">
              <div className="flex h-full flex-col rounded-sm border border-border bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:border-champagne hover:shadow-soft">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/70 text-gold-ink"
                >
                  <Icon className="h-4 w-4" />
                </span>

                <h3 className="mt-5 font-body text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  {label}
                </h3>

                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    className="mt-2 break-words font-display text-[1.02rem] leading-snug text-ink decoration-champagne decoration-1 underline-offset-4 transition-colors duration-300 hover:text-burgundy hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-2 break-words font-display text-[1.02rem] leading-snug text-ink">
                    {value}
                  </p>
                )}

                <p className="mt-2.5 text-[0.8rem] leading-relaxed text-muted-foreground">
                  {caption}
                </p>
              </div>
            </motion.li>
          ))}

          {/* Social */}
          <motion.li variants={cardVariants} className="h-full">
            <div className="flex h-full flex-col rounded-sm border border-border bg-white p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-0.5 hover:border-champagne hover:shadow-soft">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/70 text-gold-ink"
              >
                <FaInstagram className="h-4 w-4" />
              </span>

              <h3 className="mt-5 font-body text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Social
              </h3>

              <ul className="mt-2.5 flex list-none flex-wrap items-center gap-2 p-0">
                {site.socials.map((social) => {
                  const Icon = socialIcons[social.label] ?? FaInstagram;
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow Style by Zahra on ${social.label}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-gold-ink transition-colors duration-300 hover:border-burgundy hover:bg-burgundy hover:text-cream focus-visible:border-burgundy"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground">
                Behind the seams: new pieces, fittings and studio days.
              </p>
            </div>
          </motion.li>
        </motion.ul>
      </div>
    </section>
  );
}
