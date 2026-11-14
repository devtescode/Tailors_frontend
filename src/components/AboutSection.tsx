import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Gem, HeartHandshake, Ruler, Scissors } from "lucide-react";

import aboutImage from "@/assets/about-tailor.jpg";
import SectionHeading from "@/components/brand/SectionHeading";
import WhatsAppButton from "@/components/brand/WhatsAppButton";
import { buildEnquiryMessage, whatsappLink } from "@/lib/site";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const enquiryLink = whatsappLink(buildEnquiryMessage());

const values = [
  {
    icon: Scissors,
    title: "Bespoke design",
    description:
      "A silhouette drawn around you — never pulled from a rail or repeated twice.",
  },
  {
    icon: Gem,
    title: "Premium fabrics",
    description:
      "Aso Oke, lace, silk and fine wool, chosen for how they feel and how they fall.",
  },
  {
    icon: Ruler,
    title: "Expert craftsmanship",
    description:
      "Hand-cut and hand-finished in our atelier, with every seam checked twice.",
  },
  {
    icon: HeartHandshake,
    title: "A perfect fit",
    description:
      "Personal fittings and gentle alterations until the piece feels like a second skin.",
  },
];

const stats = [
  { value: "5+", label: "Years of craftsmanship" },
  { value: "200+", label: "Happy clients" },
  { value: "500+", label: "Designs created" },
];

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-cream py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-rose/50 blur-3xl" />
        <div className="absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-champagne/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: EASE }}
            className="order-1 lg:order-2 lg:col-span-7"
          >
            <SectionHeading
              id="about-heading"
              eyebrow="Our story"
              title={
                <>
                  Made for the moments that{" "}
                  <em className="italic text-burgundy">matter most.</em>
                </>
              }
              description="Style by Zahra is a bespoke fashion house in Osogbo, creating made-to-measure outfits for weddings, celebrations, the boardroom and every day in between."
            />

            <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
              Every piece begins with a conversation and a measurement, never a
              pattern from a shelf. We source premium fabrics, cut each garment
              by hand and refine the fit until it moves the way you do — a quiet
              expression of your own style.
            </p>

            <motion.ul
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-10 grid list-none grid-cols-1 gap-x-7 gap-y-6 p-0 sm:grid-cols-2"
            >
              {values.map(({ icon: Icon, title, description }) => (
                <motion.li
                  key={title}
                  variants={itemVariants}
                  className="flex gap-4 border-t border-border/70 pt-5"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-champagne/70 text-gold-ink"
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.05rem] leading-snug text-ink">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <motion.dl
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mt-10 grid grid-cols-3 gap-4 border-t border-champagne/50 pt-7"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-1.5 font-body text-[0.56rem] uppercase leading-relaxed tracking-[0.16em] text-muted-foreground sm:text-[0.6rem]">
                    {stat.label}
                  </dt>
                  <dd className="font-display text-[1.6rem] leading-none text-burgundy sm:text-[1.9rem]">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <WhatsAppButton
                href={enquiryLink}
                variant="primary"
                ariaLabel="Enquire about a custom piece on WhatsApp"
              >
                Enquire about a custom piece
              </WhatsAppButton>

              <a href="#contact" className="btn-quiet group">
                Visit the atelier
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="order-2 lg:order-1 lg:col-span-5"
          >
            <div className="relative">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-2 -top-2 h-16 w-16 border-l border-t border-champagne/70 sm:-left-3 sm:-top-3"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2 -right-2 h-16 w-16 border-b border-r border-champagne/70 sm:-bottom-3 sm:-right-3"
                />

                <div className="relative overflow-hidden rounded-sm border border-border/70 bg-cream-dark shadow-soft">
                  <img
                    src={aboutImage}
                    alt="A Style by Zahra tailor hand-finishing a bespoke garment in the Osogbo atelier"
                    width={640}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/35 via-transparent to-transparent"
                  />
                </div>

                <div className="absolute -bottom-3 left-3 bg-burgundy px-4 py-3 shadow-lift sm:-bottom-5 sm:left-6 sm:px-5 sm:py-4">
                  <p className="font-display text-2xl leading-none text-champagne sm:text-3xl">
                    100%
                  </p>
                  <p className="mt-1.5 font-body text-[0.54rem] uppercase tracking-[0.22em] text-cream/70">
                    Made to measure
                  </p>
                </div>
              </div>

              <div className="mt-12 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t border-champagne/50 pt-5 sm:mt-14">
                <p className="font-body text-[0.55rem] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Founder &amp; creative director
                </p>
                <p className="font-script text-3xl leading-none text-burgundy sm:text-4xl">
                  Zahra
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
