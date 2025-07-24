"use client";
import { ProductsFilteredResponse } from "@/actions";
import { fetcher } from "@/lib/utils/fetcher";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export const useProducts = (
  PRODUCTS_KEY: string,
  initialData?: ProductsFilteredResponse
) => {
  const [error, setError] = useState<Error | null>(null);
  const search = useSearchParams();
  if (initialData) {
    if (
      !search.get("search") &&
      !search.get("brand") &&
      !search.get("categories")
    ) {
      return { productos: initialData, isLoading: false, error: false };
    }
  } else {
    console.log("llamando a productos");
  }
  const {
    data,
    error: fetchError,
    isLoading,
  } = useSWR<ProductsFilteredResponse>(PRODUCTS_KEY, fetcher, {
    revalidateOnFocus: false, // para que no vuelva a hacer fetch al cambiar de pestaña
    shouldRetryOnError: false, // evita reintentos automáticos
    onError: (err) => {
      setError(err);
    },
    fallbackData: initialData,
  });
  return {
    isLoading,
    isError: !!error || !!fetchError,
    productos: data,
  };
};
