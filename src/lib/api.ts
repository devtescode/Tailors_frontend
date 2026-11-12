import type { CatalogItem, Product } from "./types";

const envUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_URL = (envUrl || "https://tailors-backend.onrender.com").replace(/\/$/, "");

export const TOKEN_KEY = "token";
const REQUEST_TIMEOUT = 45_000;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = RequestInit & { timeout?: number };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = REQUEST_TIMEOUT, ...init } = options;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: init.signal ?? controller.signal,
    });

    const text = await response.text();
    let data: unknown = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const message =
        (typeof data === "object" && data && "message" in data && String((data as { message: unknown }).message)) ||
        `Request failed (${response.status})`;
      throw new ApiError(message, response.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request timed out. Please check your connection and try again.");
    }
    throw new ApiError("We could not reach the server. Please check your connection and try again.");
  } finally {
    window.clearTimeout(timer);
  }
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Public catalog. The admin endpoints keep using the same product contract. */
export async function fetchProducts(options: { token?: string | null; signal?: AbortSignal } = {}) {
  const token = options.token ?? null;
  const data = await request<unknown>("/products/getallproducts", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    signal: options.signal,
  });

  return normalizeCatalog(data);
}

export function normalizeCatalog(data: unknown): CatalogItem[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item, index) => {
      const rawPrice = Number(item.price);
      const _id = String(item._id ?? item.id ?? `creation-${index}`);

      return {
        _id,
        id: _id,
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

export async function getAdminStatus(): Promise<{ adminExists: boolean }> {
  const data = await request<{ adminExists?: boolean }>("/admin/status");
  return { adminExists: Boolean(data?.adminExists) };
}

export async function loginAdmin(email: string, password: string): Promise<string> {
  const data = await request<{ token?: string }>("/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!data?.token) throw new ApiError("The server did not return an access token.");
  return data.token;
}

export async function registerAdmin(email: string, password: string): Promise<void> {
  await request("/admin/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  await request("/admin/changepassword", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

function toPayload(form: FormData) {
  return { method: "POST", headers: authHeaders(), body: form } as const;
}

export async function createProduct(form: FormData): Promise<void> {
  await request("/products/addproducts", toPayload(form));
}

export async function updateProduct(id: string, form: FormData): Promise<void> {
  await request(`/products/editproducts/${id}`, {
    ...toPayload(form),
    method: "PUT",
  });
}

export async function deleteProduct(id: string): Promise<void> {
  await request(`/products/deleteproducts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}

export type { Product };
