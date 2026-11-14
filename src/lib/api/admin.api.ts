import type { AdminCredentials } from "../types";
import { apiRequest } from "./client";

export interface AdminStatus {
  adminExists: boolean;
}

export async function getAdminStatus(signal?: AbortSignal): Promise<AdminStatus> {
  const data = await apiRequest<{ adminExists?: boolean }>("/admin/status", { signal });
  return { adminExists: Boolean(data?.adminExists) };
}

export async function loginAdmin(credentials: AdminCredentials): Promise<string> {
  const data = await apiRequest<{ token?: string }>("/admin/login", {
    method: "POST",
    json: credentials,
  });

  if (!data?.token) {
    throw new Error("The server did not return an access token.");
  }

  return data.token;
}

export async function registerAdmin(credentials: AdminCredentials): Promise<void> {
  await apiRequest("/admin/register", {
    method: "POST",
    json: credentials,
  });
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function changeAdminPassword(
  input: ChangePasswordInput,
  signal?: AbortSignal,
): Promise<void> {
  await apiRequest("/admin/changepassword", {
    method: "PUT",
    json: input,
    auth: true,
    signal,
  });
}
