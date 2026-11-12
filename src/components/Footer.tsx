import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaTwitter, FaTiktok } from "react-icons/fa";
const socialLinks = [
  { icon: <FaInstagram aria-hidden="true" />, label: "Instagram", href: "https://instagram.com/tailorcraft" },
  { icon: <FaFacebook aria-hidden="true" />, label: "Facebook", href: "https://facebook.com/tailorcraft" },
  { icon: <FaTwitter aria-hidden="true" />, label: "Twitter / X", href: "https://x.com/tailorcraft" },
  { icon: <FaTiktok aria-hidden="true" />, label: "TikTok", href: "https://tiktok.com/@tailorcraft" },
];



const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground pt-10 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 ">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-display text-3xl font-bold mb-4">
              Tailor<span className="text-gold">Craft</span>
            </p>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              Premium bespoke tailoring that celebrates African heritage. Every stitch tells a story of excellence and elegance.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-display font-semibold text-lg mb-5">Quick Links</h2>
            <nav aria-label="Footer" className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-primary-foreground/60 hover:text-gold text-sm transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display font-semibold text-lg mb-5">Follow Us</h2>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.label}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-xl bg-primary-foreground/10 hover:bg-gold/20 flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-primary-foreground/40 text-xs mt-4">
              Follow us for latest designs & behind-the-scenes content ✨
            </p>
          </motion.div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-10">
          <p className="text-primary-foreground/40 text-xs mt-8">© {new Date().getFullYear()} TailorCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
