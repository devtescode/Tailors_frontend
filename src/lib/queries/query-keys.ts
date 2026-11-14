/** Centralised React Query keys — never inline query keys in components. */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: ["products", "list"] as const,
  },
  admin: {
    status: ["admin", "status"] as const,
  },
} as const;
