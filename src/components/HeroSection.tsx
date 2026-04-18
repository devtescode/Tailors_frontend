import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax feel */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Tailor atelier" className="w-full h-full object-cover scale-110" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-sm mb-8"
        >
          <Sparkles className="text-gold" size={16} />
          <span className="text-gold-light font-body text-sm uppercase tracking-[0.2em]">
            Premium Bespoke Tailoring
          </span>
          <Sparkles className="text-gold" size={16} />
        </motion.div> */}

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="font-display text-5xl sm:text-6xl md:text-8xl font-bold text-primary-foreground leading-[1.1] mt-14"
        >
          Elegance,{" "}
          <span className="relative inline-block">
            <span className="italic text-gradient-gold">Stitched</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-gold to-gold-light"
            />
          </span>
          <br />
          to Perfection
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-primary-foreground/70 text-lg md:text-xl mb-12 font-body max-w-2xl mx-auto leading-relaxed"
        >
          Handcrafted designs that celebrate African heritage with modern sophistication.
          Every stitch tells a story of excellence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-5 justify-center"
        >
          <a
            href="#products"
            className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-gold to-gold-light text-accent-foreground font-bold text-lg shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            ✨ Explore Collection
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-primary-foreground/20 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/10 hover:border-primary-foreground/40 transition-all duration-300"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex justify-center gap-12 md:gap-20"
        >
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "15+", label: "Years Experience" },
            { value: "1000+", label: "Designs Created" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-gold">{stat.value}</p>
              <p className="text-primary-foreground/50 text-xs md:text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {/* <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className=" absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className=" text-primary-foreground/40 text-xs uppercase tracking-widest">Scroll</span>
        <ArrowDown className="text-primary-foreground/40" size={20} />
      </motion.div> */}
    </section>
  );
}
