import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken } from "../api/client";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../api/products.api";
import type { CatalogItem } from "../types";
import { queryKeys } from "./query-keys";

const PRODUCTS_STALE_TIME = 60_000;
const PRODUCTS_GC_TIME = 10 * 60_000;

export function useProducts(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.products.list,
    queryFn: ({ signal }) => fetchProducts({ signal, token: getToken() }),
    staleTime: PRODUCTS_STALE_TIME,
    gcTime: PRODUCTS_GC_TIME,
    enabled: options.enabled ?? true,
  });
}

/** Create one or many products in a single, duplicate-safe mutation. */
export function useAddProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (forms: FormData[]) => {
      let created = 0;
      for (const form of forms) {
        await createProduct(form);
        created += 1;
      }
      return created;
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export interface EditProductInput {
  id: string;
  form: FormData;
}

export function useEditProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: EditProductInput) => updateProduct(id, form),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.list });
      const previous = queryClient.getQueryData<CatalogItem[]>(queryKeys.products.list);

      if (previous) {
        queryClient.setQueryData<CatalogItem[]>(
          queryKeys.products.list,
          previous.filter((product) => product._id !== id && product.id !== id),
        );
      }

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.products.list, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
