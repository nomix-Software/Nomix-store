"use client";
import { ProductProps } from "@/components";
import { fetcher } from "@/lib/utils/fetcher";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const FAVORITOS_KEY = "/api/favorites";

export interface FavoritoType {
      productID: number;
      name: string;
      price: number;
      slug:{current: string};
      image: string;
      id:number
    }
export const useFavorites = () => {
  const [hasRetried, setHasRetried] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const session = useSession()


  const shouldFetch = !hasRetried ;

  const {
    data,
    error: fetchError,
    isLoading,
  } = useSWR(shouldFetch && session ? FAVORITOS_KEY : null, fetcher, {
    revalidateOnFocus: false, // para que no vuelva a hacer fetch al cambiar de pestaña
    shouldRetryOnError: false, // evita reintentos automáticos
    onError: (err) => {
      if (err.status === 401) {
        setError(new Error("No estás autenticado. Por favor, inicia sesión"));
        setHasRetried(true); // Marca que falló y no debe volver a intentar
      } else {
        setError(err);
      }
    },
  });

  useEffect(() => {
    if (fetchError?.status === 401 && !hasRetried) {
      setError(new Error("No estás autenticado. Por favor, inicia sesión"));
      setHasRetried(true);
    }
  }, [fetchError]);

  const add = async (product: ProductProps['product']) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ productId: product.id }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Error al agregar el producto a favoritos");
      return;
    }

     const nuevoFavorit = await res.json();
    const nuevoFavorito = {...product, productID: product.id}

    mutate(
      FAVORITOS_KEY,
      (current: FavoritoType[] = []) => [...current, nuevoFavorito],
      false
    );
  };

  const remove = async (productoId: string) => {
    const res = await fetch("/api/favorites", {
      method: "DELETE",
      body: JSON.stringify({ productoId }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Error al eliminar el producto de favoritos");
      return;
    }

    mutate(
      FAVORITOS_KEY,
      (current: FavoritoType[] = []) =>
        current.filter((item) => item.productID !== Number(productoId)),
      false
    );
  };

  return {
    favoritos: (data || []) as {
      productID: number;
      name: string;
      price: number;
      slug:{current: string};
      image: string;
      id:number
    }[],
    isLoading,
    isError: !!error,
    add,
    remove,
  };
};
