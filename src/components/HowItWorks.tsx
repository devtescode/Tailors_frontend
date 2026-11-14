import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Package, Ruler, Scissors } from "lucide-react";

import SectionHeading from "@/components/brand/SectionHeading";
import WhatsAppButton from "@/components/brand/WhatsAppButton";
import { GENERAL_WHATSAPP_LINK } from "@/lib/site";

const steps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Chat with us",
    description:
      "Browse the collection or send us an inspiration photo on WhatsApp. Tell us about the occasion and the look you have in mind.",
  },
  {
    icon: Ruler,
    number: "02",
    title: "Share your measurements",
    description:
      "Send your measurements or visit us in Osogbo for a fitting. We note every detail so the finish feels properly yours.",
  },
  {
    icon: Scissors,
    number: "03",
    title: "We craft your outfit",
    description:
      "Your fabric is cut and your outfit is sewn with care — from the first seam to the final hand-finished detail.",
  },
  {
    icon: Package,
    number: "04",
    title: "Receive your outfit",
    description:
      "Collect your piece in Osogbo or arrange nationwide delivery, then step out in something made entirely for you.",
  },
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-burgundy py-20 text-cream sm:py-24 lg:py-32"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold/60" />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-16 hidden h-80 w-80 border border-gold/15 lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-28 -left-20 hidden h-72 w-72 border border-cream/10 lg:block"
      />

      <div className="container relative mx-auto">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <SectionHeading
            id="process-heading"
            tone="light"
            align="center"
            eyebrow="Our process"
            title={
              <>
                From conversation to{" "}
                <em className="italic text-gold-light">creation.</em>
              </>
            }
            description="A considered four-step journey, guided personally from the first message to the moment your outfit is in your hands."
          />
        </motion.div>

        <ol className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <motion.li
              key={step.number}
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE, delay: index * 0.09 }}
              className="h-full"
            >
              <article className="group relative flex h-full flex-col border border-cream/15 bg-cream/[0.045] p-6 transition-colors duration-500 hover:border-gold/50 hover:bg-cream/[0.07] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold-light transition-colors duration-500 group-hover:bg-gold group-hover:text-burgundy-deep"
                  >
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display text-2xl leading-none text-gold-light/70"
                  >
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-[1.3rem] leading-tight text-cream">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-cream/65">
                  {step.description}
                </p>
              </article>
            </motion.li>
          ))}
        </ol>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="mt-12 flex flex-col items-center gap-4 border-t border-cream/15 pt-8 text-center sm:mt-14 sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <p className="font-display text-[1.2rem] leading-snug text-cream sm:text-[1.35rem]">
              Ready to begin your piece?
            </p>
            <p className="mt-1 text-sm text-cream/60">
              Message the atelier and we will guide you from there.
            </p>
          </div>

          <WhatsAppButton
            href={GENERAL_WHATSAPP_LINK}
            variant="champagne"
            className="w-full sm:w-auto"
          >
            Start your order on WhatsApp
          </WhatsAppButton>
        </motion.div>
      </div>
    </section>
  );
}
