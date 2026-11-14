import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdminCredentials } from "../types";
import { setToken } from "../api/client";
import {
  changeAdminPassword,
  getAdminStatus,
  loginAdmin,
  registerAdmin,
  type ChangePasswordInput,
} from "../api/admin.api";
import { queryKeys } from "./query-keys";

export function useAdminStatus(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.admin.status,
    queryFn: ({ signal }) => getAdminStatus(signal),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    enabled: options.enabled ?? true,
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AdminCredentials) => loginAdmin(credentials),
    onSuccess: (token) => {
      setToken(token);
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useAdminRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AdminCredentials) => registerAdmin(credentials),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.status });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changeAdminPassword(input),
  });
}
