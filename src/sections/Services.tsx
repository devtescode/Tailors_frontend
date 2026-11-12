import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import SectionHeading from "@/components/brand/SectionHeading";
import WhatsAppButton from "@/components/brand/WhatsAppButton";
import { services } from "@/data/content";
import {
  buildEnquiryMessage,
  serviceEnquiryLink,
  whatsappLink,
} from "@/lib/site";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const generalEnquiryLink = whatsappLink(buildEnquiryMessage());
const customDesignLink = whatsappLink(buildEnquiryMessage("Custom Designs"));

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative bg-cream py-20 sm:py-24 lg:py-32"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8"
        >
          <div className="lg:col-span-7">
            <SectionHeading
              id="services-heading"
              eyebrow="Our Tailoring Services"
              title={
                <>
                  Clothing made for the way you{" "}
                  <em className="italic text-burgundy">live.</em>
                </>
              }
              description="From traditional outfits to fully custom designs, each piece is cut, fitted and finished with care in our Osogbo atelier."
            />
          </div>

          <div className="border-t border-border/70 pt-6 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:border-champagne/50 lg:pb-1 lg:pl-8">
            <p className="font-display text-[1.3rem] leading-snug text-ink sm:text-[1.45rem]">
              Every service begins with a{" "}
              <em className="italic text-burgundy">conversation.</em>
            </p>
            <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-muted-foreground">
              Share the occasion, a reference or a sketch. We will talk through
              fabric, fit and finish before anything is cut.
            </p>
            <WhatsAppButton
              variant="quiet"
              href={generalEnquiryLink}
              className="mt-6"
              ariaLabel="Start a conversation on WhatsApp about your tailoring project"
            >
              Start a conversation
            </WhatsAppButton>
          </div>
        </motion.div>

        <motion.ul
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid list-none grid-cols-1 gap-x-6 gap-y-10 p-0 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-12"
        >
          {services.map((service, index) => {
            const number = String(index + 1).padStart(2, "0");
            const category = service.id.replace(/-/g, " ");

            return (
              <motion.li
                key={service.id}
                variants={cardVariants}
                className="h-full"
              >
                <article
                  aria-labelledby={`service-${service.id}-title`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-border/80 bg-white transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-champagne hover:shadow-soft focus-within:-translate-y-1 focus-within:border-champagne focus-within:shadow-soft"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
                    <img
                      src={service.image}
                      alt={service.imageAlt}
                      width={800}
                      height={1000}
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.style.opacity = "0";
                      }}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] group-focus-within:scale-[1.04]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5 lg:p-6">
                    <div className="flex items-center gap-3">
                      <span className="font-display text-[0.95rem] tracking-[0.16em] text-champagne-ink">
                        {number}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-px flex-1 bg-border"
                      />
                      <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.26em] text-champagne-ink">
                        {category}
                      </span>
                    </div>

                    <h3
                      id={`service-${service.id}-title`}
                      className="mt-4 font-display text-[1.35rem] leading-[1.2] text-ink sm:text-[1.4rem]"
                    >
                      {service.title}
                    </h3>

                    <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <a
                      href={serviceEnquiryLink(service.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Enquire about ${service.title} on WhatsApp`}
                      className="group/link mt-auto inline-flex w-fit items-center gap-2 pt-5 font-body text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-burgundy transition-colors duration-300 hover:text-gold-ink"
                    >
                      Enquire about this service
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      />
                    </a>
                  </div>
                </article>
              </motion.li>
            );
          })}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mt-14 border-t border-border/70 pt-7 sm:mt-16"
        >
          <p className="text-pretty font-display text-[1.1rem] leading-relaxed text-ink sm:text-[1.2rem]">
            Not sure where your idea fits?{" "}
            <a
              href={customDesignLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group/closing inline-flex items-baseline gap-1.5 font-body text-[0.9rem] font-medium not-italic tracking-normal text-burgundy underline decoration-champagne decoration-1 underline-offset-4 transition-colors duration-300 hover:text-gold-ink sm:text-[0.95rem]"
            >
              Tell us about it on WhatsApp
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 self-center transition-transform duration-300 group-hover/closing:-translate-y-0.5 group-hover/closing:translate-x-0.5"
              />
            </a>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
