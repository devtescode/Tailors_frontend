import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle, Mail } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/store";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";


const contactInfo = [
  {
    icon: FaPhoneAlt,
    label: "Call Us",
    value: "+234 801 234 5678",
    href: "tel:+2348012345678",
  },
  {
    icon: FaEnvelope,
    label: "Email Us",
    value: "hello@tailorcraft.ng",
    href: "mailto:hello@tailorcraft.ng",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Visit Our Studio",
    value: "12 Bode Thomas St, Surulere, Lagos",
    href: "https://maps.google.com",
  },
  {
    icon: FaClock,
    label: "Working Hours",
    value: "Mon – Sat, 9:00 AM – 6:00 PM",
    href: "#",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs uppercase tracking-[0.25em] mb-4 font-body font-medium">
            📬 Get in Touch
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground">
            Let's Create <span className="italic text-gold">Together</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Ready to get your dream outfit? Reach out to us through any of these channels.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-14">
          {contactInfo.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 text-center hover:shadow-xl hover:border-gold/20 transition-all duration-500 border border-border/50 group"
            >
              <div className="flex justify-center items-center text-3xl mb-3">{item.icon && <item.icon />}</div>
              <h3 className="font-display font-semibold text-foreground mb-1 text-sm">{item.label}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.value}</p>
            </motion.a>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello! I'd like to inquire about your tailoring services.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-5 py-4 rounded-full bg-[#25D366] text-white font-bold text-lg shadow-lg shadow-[#25D366]/25 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <MessageCircle size={22} />Chat on WhatsApp
          </a>
          <p className="text-muted-foreground text-sm mt-4">We typically respond within 30 minutes</p>
        </motion.div>
      </div>
    </section>
  );
}
