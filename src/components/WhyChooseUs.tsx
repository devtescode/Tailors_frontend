import { motion } from "framer-motion";
import { Shield, Clock, Sparkles, ThumbsUp, Truck, HeadphonesIcon } from "lucide-react";

const reasons = [
  {
    icon: Sparkles,
    title: "Bespoke Designs",
    description: "Every piece is uniquely crafted to match your style, body, and personality — no two outfits are the same.",
    emoji: "✨",
  },
  {
    icon: Shield,
    title: "Premium Fabrics",
    description: "We handpick only the finest materials — from luxurious Aso Oke to imported Italian lace and Swiss voile.",
    emoji: "🛡️",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    description: "Your outfit is ready when promised. We respect your schedule, especially for weddings and special events.",
    emoji: "⏰",
  },
  {
    icon: ThumbsUp,
    title: "Perfect Fit Guarantee",
    description: "Not satisfied? We'll adjust it until it fits like a glove — your comfort is our top priority.",
    emoji: "👌",
  },
  {
    icon: Truck,
    title: "Nationwide Shipping",
    description: "No matter where you are in the country, we deliver your custom outfit straight to your doorstep.",
    emoji: "🚚",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "From first measurement to final fitting, our team is available via WhatsApp to guide you every step.",
    emoji: "🎧",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs uppercase tracking-[0.25em] mb-4 font-body font-medium">
            🏆 Why Us
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground">
            Why Choose <span className="italic text-gradient-gold">TailorCraft</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            We don't just sew clothes — we craft confidence. Here's what sets us apart from the rest.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-card rounded-2xl p-8 border border-border/50 hover:border-gold/30 hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute top-6 right-6 text-3xl opacity-20 group-hover:opacity-40 transition-opacity">
                {r.emoji}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                <r.icon className="text-gold" size={26} />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">{r.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
