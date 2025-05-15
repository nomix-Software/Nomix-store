"use client";

import { useSession } from "next-auth/react";
import { useFavorites } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export interface ProductProps {
  product: {
    image: string;
    name: string;
    slug: { current: string };
    price: number;
    id: number; // Id del producto para poder hacer la petición
    _id:string
  };
  size?: "large" | "small"; // nuevo prop opcional
}

export const Product = ({
  product: { image, name, slug, price, id, _id },
  size,
}: ProductProps) => {
  const { favoritos, add, remove } = useFavorites();
  const [isFavorito, setIsFavorito] = useState(
    false
  );

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(!isFavorito){
      setIsFavorito(favoritos.some( fav => fav.productID == Number(_id)))
    }
  }, [favoritos.length])


  const toggleFavorito = async (e: React.MouseEvent) => {
    if (!session) {
      router.push(`/auth/login?redirect_uri=/`);
      return;
    }
    e.preventDefault();
    setIsFavorito((prev: boolean) => !prev);

    // Enviar la acción al backend
    if (!isFavorito) {
      await add({ image, name, slug, price, id, _id });
    } else {
      await remove(_id.toString());
    }

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

  const priceClasses = clsx("font-semibold product-price", {
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
          <div className="mt-2 w-full">
            <p
              className={clsx(
                nameClasses,
                "line-clamp-1 group-hover:line-clamp-none transition-all duration-200"
              )}
            >
              {name}
            </p>
          </div>

          <p className={priceClasses}>${price}</p>
        </Link>
      </div>
    </div>
  );
};
