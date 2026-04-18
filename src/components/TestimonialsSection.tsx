import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Adebayo Johnson",
    role: "Wedding Client",
    avatar: "AJ",
    rating: 5,
    text: "My wedding Agbada was nothing short of perfection — from the fabric selection to the final stitch. I've never felt more confident walking into a room. TailorCraft truly understands what celebration dressing means.",
  },
  {
    name: "Chioma Nwosu",
    role: "Loyal Customer · 3 Years",
    avatar: "CN",
    rating: 5,
    text: "Three years and over a dozen outfits later, I still get butterflies every time I unwrap a new piece. The consistency in quality and the way each design evolves with current trends is remarkable.",
  },
  {
    name: "Emeka Okafor",
    role: "Business Executive",
    avatar: "EO",
    rating: 5,
    text: "As someone who attends high-profile corporate events weekly, I need outfits that command respect. TailorCraft's Senator styles have become my signature — colleagues always ask who my tailor is.",
  },
  {
    name: "Fatima Bello",
    role: "Fashion Influencer",
    avatar: "FB",
    rating: 5,
    text: "I've worked with dozens of designers across West Africa, and TailorCraft stands out for their ability to merge tradition with contemporary fashion. My Ankara gown from them broke my Instagram engagement record!",
  },
  {
    name: "Oluwaseun Ade",
    role: "Groom · Dec 2024",
    avatar: "OA",
    rating: 5,
    text: "Eight groomsmen, eight perfect outfits, zero stress. The WhatsApp coordination was seamless, every measurement was spot-on, and delivery came two days early. That's the TailorCraft difference.",
  },
  {
    name: "Ngozi Eze",
    role: "Mother of the Bride",
    avatar: "NE",
    rating: 5,
    text: "My Aso Oke set for my daughter's wedding was the most beautiful outfit I've ever owned. The handwoven quality, the perfect draping of the gele — I was in tears when I first tried it on. Pure artistry.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs uppercase tracking-[0.25em] mb-4 font-body font-medium">
            ⭐ Client Stories
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground">
            Trusted by <span className="italic text-gradient-gold">Hundreds</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Real stories from real people who stepped out in confidence wearing TailorCraft designs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card rounded-2xl p-7 border border-border/50 hover:border-gold/20 hover:shadow-xl transition-all duration-500 group relative"
            >
              <Quote className="text-gold/20 mb-4 group-hover:text-gold/40 transition-colors" size={32} />
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-accent-foreground font-bold text-sm shadow-md">
                  {t.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="text-gold fill-gold" size={14} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
