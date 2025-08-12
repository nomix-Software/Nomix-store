"use client";
import React from "react";
import Link from "next/link";
import { AiOutlineLeft, AiOutlineShopping } from "react-icons/ai";

// import toast from "react-hot-toast";

import { useCartStore } from "@/store";

import { ItemCart } from "./ItemCart";
import Promotions from "./checkout/Promotion";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "./ui/Button";
// import { createCheckout } from "@/actions";

export const Cart = () => {
  const { items, setShowCart, getSubtotal } = useCartStore((state) => state);
  const subtotal = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
      <div className="cart-container max-w-lg w-full h-screen min-h-0 bg-white shadow-lg border border-gray-100 p-0 relative mt-0 mr-0 flex flex-col">
        <button
          type="button"
          className="cart-heading !flex !items-center !gap-2 !mb-6 !text-[#222] !font-bold !text-lg !bg-transparent !border-none !outline-none hover:!text-[#f02d34] transition-colors"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Tu carrito</span>
          <span className="cart-num-items">({items.length} items)</span>
        </button>

        {items.length < 1 && (
          <div className="empty-cart flex flex-col items-center justify-center !py-16">
            <AiOutlineShopping size={120} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-4">Tu carrito está vacío</h3>
            <Link href="/catalogo" onClick={() => setShowCart(false)}>
              <button
                type="button"
                className="btn !bg-[#f02d34] !text-white !rounded-full !px-6 !py-2 !shadow-md hover:!bg-[#c81c22] transition-colors"
              >
                Continuar comprando
              </button>
            </Link>
          </div>
        )}

  <div className="product-container flex-1 min-h-0 h-0 !overflow-y-auto !px-4 !pt-6 !pb-2 !space-y-4">
          {items.length >= 1 &&
            items.map((item, index) => {
              // Si el precio original es mayor al precio actual, mostrar ambos
              // Si el producto tiene descuento, se espera que item.precio sea el precio con descuento
              let precioOriginal = item.precioOriginal;
              let descuento = item.descuento;
              // Si no viene, pero el precio es menor al original, calcularlo
              if (typeof precioOriginal === 'undefined' && item.precio < item.precioOriginal) {
                precioOriginal = item.precioOriginal;
                descuento = Math.round(100 - (item.precio / item.precioOriginal) * 100);
              }
              return (
                <ItemCart
                  {...item}
                  key={index}
                  precioOriginal={precioOriginal}
                  descuento={descuento}
                />
              );
            })}
        </div>
        {items.length >= 1 && (
          <div className=" !w-full  !px-0 md:!px-6 !pt-4 border-t border-gray-100 bg-white flex flex-col gap-4 self-stretch">
            <div className="flex flex-wrap justify-between items-center min-w-0 !gap-x-2">
              <span className="text-base text-gray-600 truncate">Subtotal:</span>
              <span className="text-2xl font-extrabold text-[#f02d34] whitespace-nowrap">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-center">
              <Promotions total={getSubtotal()}/>
            </div>
            <Link href={'/checkout'} onClick={()=> setShowCart(false)} className="block !mx-auto">
              <Button
              className="!mx-auto"
              >
                Finalizar compra
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
