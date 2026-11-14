import { motion, useReducedMotion } from "framer-motion";
import {
  Gem,
  Headphones,
  Ruler,
  Scissors,
  Sparkles,
  Truck,
} from "lucide-react";

import SectionHeading from "@/components/brand/SectionHeading";

const reasons = [
  {
    icon: Sparkles,
    title: "Bespoke Designs",
    description:
      "Every piece begins with you. We design around your occasion, your style and the way you want to feel.",
  },
  {
    icon: Gem,
    title: "Premium Fabrics",
    description:
      "Luxurious lace, Aso Oke, Swiss voile and carefully sourced textiles, chosen for beauty and comfort.",
  },
  {
    icon: Scissors,
    title: "Expert Craftsmanship",
    description:
      "Clean cutting, considered construction and hand-finished details that hold their shape long after the event.",
  },
  {
    icon: Ruler,
    title: "Perfect Fit",
    description:
      "Made to your measurements, with fitting adjustments so the finish feels balanced, comfortable and yours.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    description:
      "Wherever you are in Nigeria, your finished outfit can be packaged and delivered to your door.",
  },
  {
    icon: Headphones,
    title: "Dedicated Customer Support",
    description:
      "From your first WhatsApp message to final delivery, we keep the conversation clear and personal.",
  },
] as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function WhyChooseUs() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="why-choose"
      aria-labelledby="why-heading"
      className="relative overflow-hidden border-y border-border/60 bg-cream-dark py-20 sm:py-24 lg:py-32"
    >
      <div className="container mx-auto">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <SectionHeading
            id="why-heading"
            align="center"
            eyebrow="The Zahra difference"
            title={
              <>
                Why choose{" "}
                <em className="italic text-burgundy">Style by Zahra</em>
              </>
            }
            description="A personal atelier experience built on beautiful fabric, precise fit and the quiet confidence of an outfit made only for you."
          />
        </motion.div>

        <ul className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reasons.map((reason, index) => (
            <motion.li
              key={reason.title}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: EASE, delay: index * 0.07 }}
              className="h-full"
            >
              <article className="group flex h-full flex-col border border-border/80 bg-white p-6 transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-soft focus-within:-translate-y-1 focus-within:border-gold/60 focus-within:shadow-soft sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center border border-champagne/80 bg-burgundy-soft text-burgundy transition-colors duration-500 group-hover:bg-burgundy group-hover:text-cream"
                  >
                    <reason.icon className="h-5 w-5" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-display text-[0.95rem] tracking-[0.18em] text-gold-ink"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-[1.3rem] leading-tight text-ink">
                  {reason.title}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
