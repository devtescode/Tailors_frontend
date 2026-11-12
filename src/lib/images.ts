import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import { API_URL } from "./api";

/** Locally bundled editorial placeholders. Replace these files to update the samples. */
export const editorialImages = [product1, product2, product3, product4, product5, product6];

export const productImages: Record<string, string> = {
  "1": product1,
  "2": product2,
  "3": product3,
  "4": product4,
  "5": product5,
  "6": product6,
};

/** Keep admin-uploaded paths working whether the API returns absolute or relative URLs. */
export function resolveImageUrl(imageURL?: string): string | null {
  const value = imageURL?.trim();
  if (!value) return null;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("/")) return `${API_URL}${value}`;
  return `${API_URL}/${value.replace(/^\.?\//, "")}`;
}

function hashIndex(seed: string, length: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100_000;
  }
  return Math.abs(hash) % length;
}

export function getFallbackImage(seed = "style-by-zahra"): string {
  return editorialImages[hashIndex(seed, editorialImages.length)];
}

export function getProductImage(id: string, imageURL?: string): string {
  return resolveImageUrl(imageURL) ?? productImages[id] ?? getFallbackImage(id);
}
