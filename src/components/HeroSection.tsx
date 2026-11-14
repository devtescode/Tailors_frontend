import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import heroImage from "@/assets/hero-bg.jpg";
import { GENERAL_WHATSAPP_LINK, site } from "@/lib/site";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stats = [
  { value: "200+", label: "Happy clients" },
  { value: "5+", label: "Years of craft" },
  { value: "500+", label: "Designs created" },
] as const;

export default function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-cream"
    >
      <div aria-hidden="true" className="gold-line absolute inset-x-0 top-0 z-10 h-px" />

      <div className="container mx-auto">
        <div className="grid items-stretch gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
          {/* Copy */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex flex-col justify-center lg:col-span-6 lg:py-8"
          >
            <p className="eyebrow">
              <span aria-hidden="true" className="h-px w-8 bg-gold" />
              Bespoke fashion · Osogbo
            </p>

            <h1
              id="hero-heading"
              className="mt-6 max-w-xl font-display text-[2.5rem] leading-[1.02] tracking-[-0.03em] text-ink sm:text-[3.3rem] lg:text-[3.7rem] xl:text-[4.2rem]"
            >
              Style by Zahra.
              <span className="mt-1 block">
                Dress with{" "}
                <em className="italic text-burgundy">Confidence.</em>
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed text-muted-foreground sm:text-base">
              {site.supporting}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#collection" className="btn-primary w-full sm:w-auto">
                Explore collection
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>

              <a
                href={GENERAL_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full sm:w-auto"
              >
                <FaWhatsapp aria-hidden="true" className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>

            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 text-gold-ink">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                Made to measure
              </span>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <span>{site.whatsapp.display}</span>
            </p>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-border/80 pt-6 sm:gap-5">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.35 + index * 0.08 }}
                  className="flex flex-col-reverse"
                >
                  <dt className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-[0.64rem]">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-[1.6rem] leading-none text-burgundy sm:text-3xl">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>

          {/* Editorial image */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="relative lg:col-span-6"
          >
            <div
              aria-hidden="true"
              className="absolute -right-3 top-5 hidden h-full w-full border border-gold/50 lg:block"
            />

            <div className="relative overflow-hidden border border-border bg-cream-dark">
              <img
                src={heroImage}
                alt="Editorial portrait of a Style by Zahra bespoke outfit in the Osogbo atelier"
                width={1200}
                height={1500}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="aspect-[4/5] h-full w-full object-cover sm:aspect-[5/5] lg:aspect-[4/5]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/45 via-transparent to-transparent"
              />

              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6">
                <div className="border-l-2 border-gold bg-cream/95 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
                  <p className="font-body text-[0.54rem] font-semibold uppercase tracking-[0.24em] text-gold-ink">
                    The atelier
                  </p>
                  <p className="mt-1 font-display text-[1.05rem] leading-tight text-ink sm:text-[1.2rem]">
                    Made for your moment
                  </p>
                </div>

                <span className="hidden border border-cream/30 bg-burgundy/80 px-3 py-2 font-body text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur-sm sm:inline-block">
                  Osogbo, Osun State
                </span>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute -bottom-4 left-6 hidden h-16 w-16 border border-gold/60 bg-cream sm:block"
            />
            <span className="absolute -bottom-7 left-[2.35rem] hidden font-script text-3xl text-burgundy sm:block">
              Zahra
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
