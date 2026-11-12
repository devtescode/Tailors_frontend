/**
 * Single source of truth for the Style by Zahra brand.
 * Change the WhatsApp number, location or tagline here and the whole site follows.
 */

export const site = {
  name: "Style by Zahra",
  tagline: "Elegance in Every Stitch.",
  supporting: "Beautifully crafted outfits, tailored to fit your style.",
  description:
    "Discover beautiful bespoke tailoring and custom fashion designs at Style by Zahra. Quality craftsmanship, elegant outfits and perfect finishing in Osogbo, Osun State, Nigeria.",
  announcement: "Quality tailoring, made just for you.",
  location: {
    city: "Osogbo",
    state: "Osun State",
    country: "Nigeria",
    full: "Osogbo, Osun State, Nigeria",
  },
  whatsapp: {
    display: "0816 940 6539",
    local: "08169406539",
    international: "2348169406539",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Osogbo, Osun State, Nigeria"),
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Our Services", href: "#services" },
  { label: "Our Creations", href: "#creations" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SERVICE_OPTIONS = [
  "Traditional Outfits",
  "Native Attire",
  "Corporate Wear",
  "Casual Outfits",
  "Special Occasion Outfits",
  "Custom Designs",
  "General enquiry",
] as const;

/** The exact enquiry template requested by the owner. */
export function buildEnquiryMessage(service?: string, notes?: string): string {
  const lines = [
    "Hello Style by Zahra, I would like to make an enquiry about your tailoring services.",
    "",
  ];

  if (service) lines.push(`Service: ${service}`, "");

  lines.push(
    "I would like to discuss my preferred design, measurements and pricing.",
    "",
    "Please provide more information.",
  );

  if (notes?.trim()) lines.push("", notes.trim());

  return lines.join("\n");
}

export function whatsappLink(message: string = buildEnquiryMessage()): string {
  return `https://wa.me/${site.whatsapp.international}?text=${encodeURIComponent(message)}`;
}

export function serviceEnquiryLink(service: string): string {
  return whatsappLink(buildEnquiryMessage(service));
}

/** "Book an order" / header / floating button. */
export const GENERAL_WHATSAPP_LINK = whatsappLink();

export const ADMIN_PATH = "/admin";
