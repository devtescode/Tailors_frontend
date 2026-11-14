import { motion, type Variants } from "framer-motion";
import { Quote, Star } from "lucide-react";

import SectionHeading from "@/components/brand/SectionHeading";
import WhatsAppButton from "@/components/brand/WhatsAppButton";
import { GENERAL_WHATSAPP_LINK } from "@/lib/site";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Testimonial = {
  name: string;
  role: string;
  monogram: string;
  rating: number;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Adebayo Johnson",
    role: "Wedding Client",
    monogram: "AJ",
    rating: 5,
    quote:
      "My wedding agbada was nothing short of perfection — from the fabric selection to the final stitch. I have never felt more confident walking into a room. Style by Zahra understood exactly what celebration dressing should feel like.",
  },
  {
    name: "Chioma Nwosu",
    role: "Loyal Customer",
    monogram: "CN",
    rating: 5,
    quote:
      "Three years and more than a dozen outfits later, I still feel a little flutter every time I unwrap a new piece. The quality never slips, and each design grows with me rather than chasing a trend.",
  },
  {
    name: "Emeka Okafor",
    role: "Business Executive",
    monogram: "EO",
    rating: 5,
    quote:
      "I am in boardrooms every week, so I need clothes that carry me without shouting. The senator styles Zahra cuts for me have become my signature — colleagues still ask who my tailor is.",
  },
  {
    name: "Fatima Bello",
    role: "Fashion Influencer",
    monogram: "FB",
    rating: 5,
    quote:
      "I have worked with many designers across West Africa, and Style by Zahra stands apart for the way she marries tradition with a modern line. The Ankara gown she made me is still my most-liked post.",
  },
  {
    name: "Oluwaseun Ade",
    role: "Groom",
    monogram: "OA",
    rating: 5,
    quote:
      "Eight groomsmen, eight perfect outfits, zero stress. Everything was coordinated on WhatsApp, every measurement was exact, and delivery arrived two days early. That is the difference care makes.",
  },
  {
    name: "Ngozi Eze",
    role: "Mother of the Bride",
    monogram: "NE",
    rating: 5,
    quote:
      "My aso oke set for my daughter's wedding was the most beautiful outfit I have ever owned. The handwoven cloth, the way the gele draped — I was in tears at the first fitting. Pure artistry.",
  },
];

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-rose-light py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-16 h-72 w-72 rounded-full bg-burgundy-soft/70 blur-3xl"
      />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <SectionHeading
            id="testimonials-heading"
            eyebrow="Client stories"
            align="center"
            title={
              <>
                Loved by our <em className="italic text-burgundy">clients.</em>
              </>
            }
            description="Six clients, six occasions, one standard of finish. These are the words they shared after the final fitting."
          />
        </motion.div>

        <motion.ul
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid list-none grid-cols-1 gap-5 p-0 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.li
              key={testimonial.name}
              variants={cardVariants}
              className="h-full"
            >
              <figure className="group relative flex h-full flex-col rounded-sm border border-border bg-white p-6 shadow-soft transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-champagne hover:shadow-soft sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <Quote
                    aria-hidden="true"
                    className="h-7 w-7 shrink-0 text-champagne transition-colors duration-500 group-hover:text-champagne/80"
                    strokeWidth={1.25}
                  />
                  <div
                    role="img"
                    aria-label={`Rated ${testimonial.rating} out of 5`}
                    className="flex items-center gap-0.5 pt-1"
                  >
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                      <Star
                        key={index}
                        aria-hidden="true"
                        strokeWidth={0}
                        className="h-3.5 w-3.5 fill-gold text-gold"
                      />
                    ))}
                  </div>
                </div>

                <blockquote className="mt-5 flex-1">
                  <p className="text-[0.93rem] leading-[1.75] text-ink-soft">
                    {testimonial.quote}
                  </p>
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3.5 border-t border-border/80 pt-5">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champagne/70 bg-burgundy-soft font-display text-[0.76rem] tracking-[0.08em] text-burgundy"
                  >
                    {testimonial.monogram}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[1rem] leading-tight text-ink">
                      {testimonial.name}
                    </span>
                    <span className="mt-1 block font-body text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {testimonial.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mt-12 flex flex-col items-center gap-4 text-center sm:mt-14"
        >
          <p className="max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">
            Every story begins with a conversation. Tell us what you are dressing
            for, and we will take it from there.
          </p>
          <WhatsAppButton
            href={GENERAL_WHATSAPP_LINK}
            variant="outline"
            ariaLabel="Start your own Style by Zahra story on WhatsApp"
          >
            Begin your story
          </WhatsAppButton>
        </motion.div>
      </div>
    </section>
  );
}
