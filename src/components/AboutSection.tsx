import { motion } from "framer-motion";
import { Scissors, Ruler, Award, Heart } from "lucide-react";
import aboutImg from "@/assets/about-tailor.jpg";

const features = [
  {
    icon: Scissors,
    title: "Master Craftsmanship",
    description: "Over 15 years of experience in bespoke tailoring with meticulous attention to every detail.",
  },
  {
    icon: Ruler,
    title: "Perfect Fit Guarantee",
    description: "Every garment is custom-measured and tailored to your exact body specifications.",
  },
  {
    icon: Award,
    title: "Premium Materials",
    description: "We source only the finest fabrics from across Africa and the world.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every piece carries our passion for African fashion and heritage.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs uppercase tracking-[0.25em] mb-4 font-body font-medium">
              ✂️ About Us
            </span>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Where Tradition Meets{" "}
              <span className="italic text-gradient-gold">Elegance</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
              At TailorCraft, we believe clothing is more than fabric — it's an expression of identity.
              Our atelier blends time-honored African tailoring traditions with contemporary design,
              creating pieces that make you feel extraordinary.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                    <feature.icon className="text-gold" size={22} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1 text-sm">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-md overflow-hidden shadow-xl">
              <img
                src={aboutImg}
                alt="Master tailor at work in the TailorCraft atelier"
                loading="lazy"
                width={640}
                height={854}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-8 -left-8 bg-card p-1 px-3 py-0 rounded-md shadow-2xl"
            >
              <p className="font-display text-4xl font-bold text-gold">15+</p>
              <p className="text-muted-foreground text-sm mt-1">Years of Excellence</p>
            </motion.div>
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="absolute -top-6 -right-6 bg-card p-4 rounded-2xl shadow-2xl border border-border"
            >
              <p className="text-2xl mb-1">⭐⭐⭐⭐⭐</p>
              <p className="text-muted-foreground text-xs">500+ Happy Clients</p>
            </motion.div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
