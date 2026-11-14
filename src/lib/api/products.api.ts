import type { CatalogItem } from "../types";
import { apiRequest } from "./client";

/** Normalise the backend's product records into a single, predictable shape. */
export function normalizeCatalog(data: unknown): CatalogItem[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item, index) => {
      const rawPrice = Number(item.price);
      const id = String(item._id ?? item.id ?? `creation-${index}`);

      return {
        _id: id,
        id,
        name: String(item.name ?? "Untitled creation"),
        price: Number.isFinite(rawPrice) ? rawPrice : 0,
        description: String(item.description ?? ""),
        imageURL: String(item.imageURL ?? ""),
        category: item.category ? String(item.category) : undefined,
        createdAt: item.createdAt ? String(item.createdAt) : undefined,
        updatedAt: item.updatedAt ? String(item.updatedAt) : undefined,
      } satisfies CatalogItem;
    });
}

export interface FetchProductsOptions {
  token?: string | null;
  signal?: AbortSignal;
}

export async function fetchProducts(options: FetchProductsOptions = {}): Promise<CatalogItem[]> {
  const data = await apiRequest<unknown>("/products/getallproducts", {
    signal: options.signal,
    headers: options.token ? { Authorization: `Bearer ${options.token}` } : undefined,
  });

  return normalizeCatalog(data);
}

export async function createProduct(form: FormData, signal?: AbortSignal): Promise<void> {
  await apiRequest("/products/addproducts", {
    method: "POST",
    body: form,
    auth: true,
    signal,
  });
}

export async function updateProduct(id: string, form: FormData, signal?: AbortSignal): Promise<void> {
  await apiRequest(`/products/editproducts/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: form,
    auth: true,
    signal,
  });
}

export async function deleteProduct(id: string, signal?: AbortSignal): Promise<void> {
  await apiRequest(`/products/deleteproducts/${encodeURIComponent(id)}`, {
    method: "DELETE",
    auth: true,
    signal,
  });
}
