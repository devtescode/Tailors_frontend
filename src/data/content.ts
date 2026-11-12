import {
  Award,
  HeartHandshake,
  PenTool,
  Ruler,
  Scissors,
  Sparkles,
} from "lucide-react";
import aboutTailor from "@/assets/about-tailor.jpg";
import heroTailor from "@/assets/hero-bg.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import { site } from "@/lib/site";
import type { Testimonial } from "@/lib/types";

export const heroImage = heroTailor;
export const aboutImage = aboutTailor;

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

/** Edit, rename or remove services here — the section adapts automatically. */
export const services: Service[] = [
  {
    id: "traditional",
    title: "Traditional Outfits",
    description:
      "Aso oke, iro and buba, gele and complete traditional looks, finished with the detailing your occasion deserves.",
    image: product1,
    imageAlt: "Traditional Nigerian outfit with rich fabric detailing",
  },
  {
    id: "native",
    title: "Native Attire",
    description:
      "Agbada, kaftans and senator styles cut cleanly, with comfortable fits and refined hand-finished seams.",
    image: product2,
    imageAlt: "Native attire tailored in a contemporary silhouette",
  },
  {
    id: "corporate",
    title: "Corporate Wear",
    description:
      "Structured suits, tailored separates and workwear that sit properly at the shoulder and move with you.",
    image: product3,
    imageAlt: "Corporate tailoring with a sharp, professional finish",
  },
  {
    id: "casual",
    title: "Casual Outfits",
    description:
      "Easy dresses, shirts, co-ords and everyday separates made to feel as good as they look.",
    image: product4,
    imageAlt: "Casual outfit with a relaxed, considered fit",
  },
  {
    id: "occasion",
    title: "Special Occasion Outfits",
    description:
      "Wedding, birthday and celebration pieces designed around the moment — and around you.",
    image: product5,
    imageAlt: "Special occasion outfit with elegant finishing",
  },
  {
    id: "custom",
    title: "Custom Designs",
    description:
      "Bring a sketch, a reference or an idea. We will develop the design, take your measurements and make it real.",
    image: product6,
    imageAlt: "Custom design being developed for a client",
  },
];

export interface Differentiator {
  title: string;
  description: string;
  icon: typeof Scissors;
}

export const differentiators: Differentiator[] = [
  {
    title: "Quality Craftsmanship",
    description: "Careful cutting, clean construction and finishing that holds up long after the event.",
    icon: Scissors,
  },
  {
    title: "Neat Finishing",
    description: "Tidy seams, controlled hems and the small details that make an outfit feel complete.",
    icon: Sparkles,
  },
  {
    title: "Attention to Detail",
    description: "Every measurement, button and line is considered before your outfit leaves the atelier.",
    icon: PenTool,
  },
  {
    title: "Unique Designs",
    description: "Your outfit is developed for you — not copied from a rack or repeated for someone else.",
    icon: Award,
  },
  {
    title: "Perfect Fitting",
    description: "We work from your measurements so the fit feels comfortable, balanced and yours.",
    icon: Ruler,
  },
  {
    title: "Customer Satisfaction",
    description: "Clear conversation from the first enquiry to collection, with room for fitting adjustments.",
    icon: HeartHandshake,
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Choose Your Design",
    description: "Tell us the style or outfit you have in mind, and share any inspiration you love.",
  },
  {
    number: "02",
    title: "Share Your Measurements",
    description: "Send your measurements or visit us in Osogbo for a proper fitting.",
  },
  {
    number: "03",
    title: "We Sew Your Outfit",
    description: "Your outfit is cut and carefully crafted, with attention to every finish.",
  },
  {
    number: "04",
    title: "Get Your Outfit",
    description: "Arrange collection or delivery, then step out in something made for you.",
  },
];

export interface PortfolioSample {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  illustrative: true;
}

/**
 * Sample design directions used when the atelier has not uploaded real work yet.
 * They are explicitly labelled "Design inspiration" in the UI — never as client work.
 * Replace or delete this list as the admin dashboard fills with real creations.
 */
export const portfolioSamples: PortfolioSample[] = [
  {
    id: "sample-1",
    title: "The Aso Oke Edit",
    category: "Traditional",
    description: "A hand-finished traditional look with a sculpted gele and considered trims.",
    image: product1,
    illustrative: true,
  },
  {
    id: "sample-2",
    title: "Modern Native",
    category: "Native",
    description: "Clean native tailoring with a relaxed line and subtle embroidery.",
    image: product2,
    illustrative: true,
  },
  {
    id: "sample-3",
    title: "The Working Wardrobe",
    category: "Corporate",
    description: "Sharp, structured tailoring designed for long days and confident rooms.",
    image: product3,
    illustrative: true,
  },
  {
    id: "sample-4",
    title: "Softly Tailored",
    category: "Casual",
    description: "An easy everyday silhouette with a neat neckline and gentle drape.",
    image: product4,
    illustrative: true,
  },
  {
    id: "sample-5",
    title: "Celebration Piece",
    category: "Special Occasion",
    description: "A special-occasion design with rich texture and a beautiful finishing touch.",
    image: product5,
    illustrative: true,
  },
  {
    id: "sample-6",
    title: "Made to Your Sketch",
    category: "Custom",
    description: "A one-off design developed from a client's idea, sketch and measurements.",
    image: product6,
    illustrative: true,
  },
];

export const portfolioFilters = [
  "All",
  "Traditional",
  "Native",
  "Corporate",
  "Casual",
  "Special Occasion",
  "Custom",
] as const;

/**
 * Client words are added here only after they are shared with the business.
 * The section shows a graceful invitation while this list is empty.
 */
export const testimonials: Testimonial[] = [];

export const contactChannels = [
  {
    label: "WhatsApp",
    value: site.whatsapp.display,
    helper: "Our main line for enquiries and orders",
    href: `https://wa.me/${site.whatsapp.international}`,
    external: true,
  },
  {
    label: "Atelier",
    value: site.location.full,
    helper: "By appointment · reach us on WhatsApp first",
    href: site.mapsUrl,
    external: true,
  },
  {
    label: "Business",
    value: site.name,
    helper: "Bespoke tailoring & fashion designs",
  },
] as const;
