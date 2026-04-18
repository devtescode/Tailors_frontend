import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export const productImages: Record<string, string> = {
  "1": product1,
  "2": product2,
  "3": product3,
  "4": product4,
  "5": product5,
  "6": product6,
};

export function getProductImage(id: string, imageURL?: string): string {
  if (imageURL && imageURL.startsWith("http")) return imageURL;
  return productImages[id] || product1;
}
