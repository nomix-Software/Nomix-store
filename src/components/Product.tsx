"use client";

import { useSession } from "next-auth/react";
import { useFavorites } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { formatPrice } from "@/utils/formatPrice";

export interface ProductProps {
  product: {
    image: string;
    name: string;
    slug: { current: string };
    price: number;
    id: number;
    _id: string;
    stock?: number;
  };
  size?: "large" | "small";
}

export const Product = ({
  product: { image, name, slug, price, id, _id, stock = 0 },
  size,
}: ProductProps) => {
  const { favoritos, add, remove } = useFavorites();
  const [isFavorito, setIsFavorito] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const sinStock = stock <= 0;

  useEffect(() => {
    if (!isFavorito) {
      setIsFavorito(favoritos.some((fav) => fav.productID == Number(_id)));
    }
  }, [favoritos.length]);

  const toggleFavorito = async (e: React.MouseEvent) => {
    if (!session) {
      router.push(`/auth/login?redirect_uri=/`);
      return;
    }
    e.preventDefault();
    if (sinStock) return;

    setIsFavorito((prev) => !prev);

    if (!isFavorito) {
      await add({ image, name, slug, price, id, _id });
    } else {
      await remove(_id.toString());
    }
  };

  const containerClasses = clsx(
    "product-card relative group cursor-pointer transition-transform duration-300 overflow-hidden",
    {
      "w-[250px]": size === "large",
      "w-[150px]": size === "small",
      "opacity-60 grayscale ": sinStock,
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
        {!sinStock && (
          <button
            onClick={toggleFavorito}
            className="absolute top-2 right-2 text-xl text-red-500 z-10 hover:scale-110 transition-transform cursor-pointer"
            aria-label="Agregar a favoritos"
          >
            {isFavorito ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        )}

        <Link href={`/product/${slug.current}`} className="block">
          <div className="relative">
            <Image
              src={image || ""}
              width={imageSize}
              height={imageSize}
              className="product-image w-[250px] h-[250px] object-cover"
              alt="product image"
            />

            {sinStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm md:text-base font-semibold z-20">
                Sin stock
              </div>
            )}
          </div>

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

          <p className={priceClasses}>{ formatPrice(price) }</p>
        </Link>
      </div>
    </div>
  );
};
