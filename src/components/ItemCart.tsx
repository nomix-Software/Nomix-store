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
  return (
    <div className="product">
      <Image
        src={imagen}
        width={100}
        height={100}
        className="cart-product-image"
        alt={`cart-product-${nombre}`}
      />
      <div className="flex flex-col justify-between w-full ">
        <div className="flex justify-between items-center">
          <Link href={`/product/${slug}`}>
            <h5> {nombre}</h5>
          </Link>
          <h4>${precio}</h4>
        </div>
        <div className="flex bottom">
          <Quantity
            quantity={cantidad}
            onChange={(value, action) => handleChageQty(value, action)}
          />
          <button
            type="button"
            className="remove-item"
            onClick={() => removeFromCart(id)}
          >
            <TiDeleteOutline />
          </button>
        </div>
      </div>
    </div>
  );
};
