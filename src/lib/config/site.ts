/**
 * Single source of truth for Style by Zahra business information.
 * Update the WhatsApp number, location or tagline here and the whole site follows.
 */

export const site = {
  name: "Style by Zahra",
  shortName: "Zahra",
  monogram: "SZ",
  tagline: "Premium fashion, crafted for you.",
  supporting:
    "Bespoke Nigerian fashion, made to measure. Thoughtful design, premium fabrics and a finish that feels entirely yours.",
  description:
    "Style by Zahra is a premium bespoke fashion house in Osogbo, Osun State, Nigeria. Discover elegant, made-to-measure outfits crafted for weddings, celebrations and everyday confidence.",
  announcement: "Premium fashion, crafted for you — nationwide delivery from Osogbo.",
  location: {
    city: "Osogbo",
    state: "Osun State",
    country: "Nigeria",
    full: "Osogbo, Osun State, Nigeria",
  },
  whatsapp: {
    /** The number as displayed to customers. */
    display: "08169406539",
    /** Local Nigerian format used in tel: links. */
    local: "08169406539",
    /** International format used in wa.me links (no plus sign). */
    international: "2348169406539",
    /** Canonical WhatsApp deep link. */
    url: "https://wa.me/2348169406539",
  },
  hours: "By appointment — message us on WhatsApp",
  socials: [
    { label: "Instagram", href: "https://instagram.com/stylebyzahra" },
    { label: "Facebook", href: "https://facebook.com/stylebyzahra" },
    { label: "TikTok", href: "https://tiktok.com/@stylebyzahra" },
  ],
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Osogbo, Osun State, Nigeria"),
} as const;

export const NAV_LINKS = [
  { label: "Collection", href: "#collection" },
  { label: "Our Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Testimonials", href: "#testimonials" },
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

export const ADMIN_PATH = "/admin";

/** The exact enquiry template used across the site. */
export function buildEnquiryMessage(service?: string, notes?: string): string {
  const lines = [
    `Hello ${site.name}, I would like to make an enquiry about your tailoring services.`,
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
  return `${site.whatsapp.url}?text=${encodeURIComponent(message)}`;
}

export function serviceEnquiryLink(service: string): string {
  return whatsappLink(buildEnquiryMessage(service));
}

export interface OrderProduct {
  name: string;
  price: number;
  category?: string;
}

export function buildProductOrderMessage(product: OrderProduct): string {
  const lines = [
    `Hello ${site.name}, I would like to order this piece:`,
    "",
    `Item: ${product.name}`,
  ];

  if (product.category) lines.push(`Category: ${product.category}`);
  lines.push(`Price: ${formatNaira(product.price)}`, "", "Please share the next steps for measurements and delivery.");

  return lines.join("\n");
}

export function productOrderLink(product: OrderProduct): string {
  return whatsappLink(buildProductOrderMessage(product));
}

/** "Book an order" / header / floating button. */
export const GENERAL_WHATSAPP_LINK = whatsappLink();

/** Naira formatting used by the storefront and admin dashboard. */
export function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}
