"use client";
import { ProductItem } from "@/interfaces";
import { fetcher } from "@/lib/utils/fetcher";
import {  useState } from "react";
import useSWR from "swr";



export const useProducts = (PRODUCTS_KEY : string) => {
  const [error, setError] = useState<Error | null>(null);


  const {
    data,
    error: fetchError,
    isLoading,
  } = useSWR( PRODUCTS_KEY , fetcher, {
    revalidateOnFocus: false, // para que no vuelva a hacer fetch al cambiar de pestaña
    shouldRetryOnError: false, // evita reintentos automáticos
    onError: (err) => {
        setError(err);
    },
  });
  return {
    isLoading,
    isError: !!error || !!fetchError,
    productos: data as {products:ProductItem[], filtrosDisponibles: {categorias: {nombre:string, cantidad:number}[], marcas: {nombre:string, cantidad:number}[]}, currentPage:number, totalPages:number}
  };
  };

