import { describe, expect, it } from "vitest";

import { normalizeCatalog } from "@/lib/api/products.api";
import { formatNaira, productOrderLink, site } from "@/lib/site";

describe("catalogue normalisation", () => {
  it("maps _id and id to one predictable shape", () => {
    const [product] = normalizeCatalog([
      {
        _id: "abc123",
        name: "The Adire gown",
        price: "45000",
        description: "Hand-finished occasion gown.",
        category: "Women",
        imageURL: "/uploads/adire.jpg",
      },
    ]);

    expect(product._id).toBe("abc123");
    expect(product.id).toBe("abc123");
    expect(product.name).toBe("The Adire gown");
    expect(product.price).toBe(45000);
    expect(product.category).toBe("Women");
  });

  it("returns an empty collection for malformed payloads", () => {
    expect(normalizeCatalog(null)).toEqual([]);
    expect(normalizeCatalog({ products: [] })).toEqual([]);
  });
});

describe("brand configuration", () => {
  it("uses the approved WhatsApp details", () => {
    expect(site.whatsapp.display).toBe("08169406539");
    expect(site.whatsapp.international).toBe("2348169406539");
    expect(site.whatsapp.url).toBe("https://wa.me/2348169406539");
    expect(site.location.full).toBe("Osogbo, Osun State, Nigeria");
  });

  it("formats Naira prices without decimals", () => {
    expect(formatNaira(45000)).toContain("45,000");
    expect(formatNaira(45000)).not.toContain(".00");
  });

  it("builds a product order link on the WhatsApp number", () => {
    const link = productOrderLink({
      name: "The Adire gown",
      price: 45000,
      category: "Women",
    });

    expect(link.startsWith("https://wa.me/2348169406539?text=")).toBe(true);
    expect(decodeURIComponent(link)).toContain("The Adire gown");
  });
});
