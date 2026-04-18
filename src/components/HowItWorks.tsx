import { motion } from "framer-motion";
import { MessageCircle, Ruler, Scissors, Package } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    step: "01",
    title: "Chat With Us",
    description: "Browse our collection and send us a message on WhatsApp. Tell us what you want — your style, occasion, and budget.",
    emoji: "💬",
    color: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    icon: Ruler,
    step: "02",
    title: "Share Your Measurements",
    description: "Send your body measurements or visit our studio for a professional fitting. We'll guide you through every detail.",
    emoji: "📏",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    icon: Scissors,
    step: "03",
    title: "We Craft Your Outfit",
    description: "Our master tailors get to work — cutting, stitching, and perfecting every seam with precision and care.",
    emoji: "✂️",
    color: "from-amber-500/20 to-amber-600/10",
  },
  {
    icon: Package,
    step: "04",
    title: "Receive & Shine",
    description: "Your custom outfit is delivered to you, ready to turn heads. Step out in confidence and style!",
    emoji: "📦",
    color: "from-purple-500/20 to-purple-600/10",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-28 bg-secondary relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs uppercase tracking-[0.25em] mb-4 font-body font-medium">
            🔄 Process
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground">
            How It <span className="italic text-gradient-gold">Works</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            Getting your dream outfit is easier than you think. Just four simple steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px border-t-2 border-dashed border-gold/20" />
              )}

              <div className="bg-card rounded-2xl p-8 border border-border/50 hover:border-gold/30 hover:shadow-2xl transition-all duration-500 text-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-accent-foreground font-bold text-xs px-3 py-1 rounded-full font-body">
                  Step {s.step}
                </div>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-5 mt-2 group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon className="text-gold" size={28} />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
                <div className="text-3xl mt-4 opacity-30 group-hover:opacity-60 transition-opacity">{s.emoji}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
