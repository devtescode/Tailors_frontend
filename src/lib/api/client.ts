/**
 * Centralised HTTP client for the Style by Zahra backend.
 * All server communication in the app goes through this module.
 */

export const API_URL = (
  (import.meta.env.VITE_API_URL as string | undefined) || "https://tailors-backend.onrender.com"
).replace(/\/+$/, "");

export const TOKEN_KEY = "token";
export const AUTH_EVENT = "sz:unauthorized";

const DEFAULT_TIMEOUT = 45_000;

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 0, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: HeadersInit;
  /** Raw body (FormData, Blob, string, …). */
  body?: BodyInit | null;
  /** JSON body convenience — sets the Content-Type header automatically. */
  json?: unknown;
  /** Attach the session JWT as a Bearer token. */
  auth?: boolean;
  signal?: AbortSignal;
  timeout?: number;
}

/* ------------------------------------------------------------------ */
/* Session token helpers                                               */
/* ------------------------------------------------------------------ */

export function getToken(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function notifyUnauthorized(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

/* ------------------------------------------------------------------ */
/* Request core                                                        */
/* ------------------------------------------------------------------ */

function parseBody(text: string): unknown {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(data: unknown, status: number): string {
  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    const candidate = record.message ?? record.error ?? record.msg;
    if (typeof candidate === "string" && candidate.trim()) return candidate;
  }

  if (typeof data === "string" && data.trim() && data.length < 300) return data;

  return `Request failed (${status})`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    headers: providedHeaders,
    body: providedBody,
    json,
    auth = false,
    signal,
    timeout = DEFAULT_TIMEOUT,
  } = options;

  const headers = new Headers(providedHeaders);
  let body = providedBody ?? null;

  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(json);
  }

  if (auth) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const controller = new AbortController();
  let timedOut = false;

  const timer = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  const onAbort = () => controller.abort();

  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", onAbort, { once: true });
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = parseBody(text);

    if (!response.ok) {
      if (response.status === 401 && getToken()) {
        clearToken();
        notifyUnauthorized();
      }

      throw new ApiError(extractMessage(data, response.status), response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    // Caller aborted (component unmount / React Query cancellation): preserve the abort.
    if (signal?.aborted) throw error;

    if (timedOut) {
      throw new ApiError("The request timed out. Please check your connection and try again.", 408);
    }

    throw new ApiError("We could not reach the server. Please check your connection and try again.");
  } finally {
    globalThis.clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
}

export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again.";
}
