"use client";
import React from "react";
import { Quantity } from "./ui/Quantity";
import { TiDeleteOutline } from "react-icons/ti";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store";

interface ItemCartProps {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  cantidad: number;
  imagen: string;
  stock: number;
}
export const ItemCart = ({
  nombre,
  precio,
  imagen,
  cantidad,
  stock,
  slug,
  id,
}: ItemCartProps) => {
  const { removeFromCart, substractOne, addOne } = useCartStore(
    (state) => state
  );

  const handleChageQty = (value: number, action: "substract" | "add") => {
    if (value > stock || value < 0) return;
    if (action === "substract") {
      substractOne(id, value);
      return;
    }
    if (action === "add") {
      addOne(id, value);
      return;
    }
  };

  const formatPrice = (value: number) =>
    value.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    });
  return (
    <div className="flex items-center !gap-3 !py-2 !border-b !border-gray-100 last:!border-b-0">
      <Image
        src={imagen}
        width={56}
        height={56}
        className="!rounded-xl !object-cover !bg-gray-100 !shrink-0"
        alt={`cart-product-${nombre}`}
      />
      <div className="flex flex-col justify-between w-full !min-w-0">
        <div className="flex justify-between items-center !gap-2">
          <Link href={`/product/${slug}`} className="!truncate !max-w-[120px]">
            <h5 className="!text-base !font-medium !text-[#222] !truncate">
              {nombre}
            </h5>
          </Link>
          <h4 className="!text-base !font-bold !text-[#222] !whitespace-nowrap">
            {formatPrice(precio)}
          </h4>
        </div>
        <div className="flex items-center !gap-2 !mt-2">
          <Quantity
            quantity={cantidad}
            onChange={(value, action) => handleChageQty(value, action)}
          />
          <button
            type="button"
            className="remove-item !ml-2 !text-gray-400 hover:!text-red-500 transition-colors !p-1"
            onClick={() => removeFromCart(id)}
            title="Quitar"
          >
            <TiDeleteOutline size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
