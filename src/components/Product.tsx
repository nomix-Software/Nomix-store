"use client";

import { useSession } from "next-auth/react";
import { FavoritoType, useFavorites } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import clsx from "clsx";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useSWRConfig } from "swr"; // Si usas SWR o React Query

export interface ProductProps {
  product: {
    image: string;
    name: string;
    slug: { current: string };
    price: number;
    id: number; // Id del producto para poder hacer la petición
  };
  size?: "large" | "small"; // nuevo prop opcional
}

export const Product = ({
  product: { image, name, slug, price, id }, size
}: ProductProps) => {
  const { favoritos, add, remove } = useFavorites();
  const [isFavorito, setIsFavorito] = useState(
    favoritos.some((p: FavoritoType) => p.id === id)
  );
  const { data: session } = useSession();
  // const pathname = usePathname();
  // const searchParams = useSearchParams();
   const router = useRouter();

  // const redirectUri = `${pathname}${
  //   searchParams.toString() ? `?${searchParams.toString()}` : ""
  // }`;

  const toggleFavorito = async (e: React.MouseEvent) => {
    if (!session) {
      router.push(`/auth/login?redirect_uri=/mis-favoritos`);
      return;
    }
    e.preventDefault();
    setIsFavorito((prev: boolean) => !prev);

    // Enviar la acción al backend
    if (!isFavorito) {
      await add(id.toString());
    } else {
      await remove(id.toString());
    }

    // // Refrescar la lista de favoritos en el frontend (si usas SWR o React Query)
    // mutate("/api/favoritos"); // Actualiza el cache
  };

const containerClasses = clsx(
    "product-card relative group cursor-pointer transition-transform duration-300",
    {
      "w-[250px]": size === "large",
      "w-[150px]": size === "small",
    }
  );

  const imageSize = size === "large" ? 250 : 150;

  const nameClasses = clsx("mt-2 font-medium", {
    "text-sm": size === "large",
    "text-xs": size === "small",
  });

  const priceClasses = clsx("font-semibold text-purple-600", {
    "text-lg": size === "large",
    "text-sm": size === "small",
  });

  return (
    <div className="relative">
      <div className={containerClasses}>
        <button
          onClick={toggleFavorito}
          className="absolute top-2 right-2 text-xl text-red-500 z-10 hover:scale-110 transition-transform cursor-pointer"
          aria-label="Agregar a favoritos"
        >
          {isFavorito ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>

        <Link href={`/product/${slug.current}`}>
          <Image
            src={image || ""}
            width={imageSize}
            height={imageSize}
            className="product-image w-full h-auto object-cover"
            alt="product image"
          />
          <p className={nameClasses}>{name}</p>
          <p className={priceClasses}>${price}</p>
        </Link>
      </div>
    </div>
  );
};
