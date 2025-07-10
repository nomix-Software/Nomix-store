"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { AiOutlineLeft, AiOutlineShopping } from "react-icons/ai";

// import toast from "react-hot-toast";

import { useCartStore } from "@/store";

import { ItemCart } from "./ItemCart";
import Promotions from "./checkout/Promotion";
// import { createCheckout } from "@/actions";

export const Cart = () => {
  const cartRef = useRef(null);
  const { items, setShowCart, getSubtotal } = useCartStore((state) => state);
  const subtotal = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  );

  // const handleCheckout = async () => {
  //   // const stripe = await getStripe();

  //   // const response = await fetch("/api/stripe", {
  //   //   method: "POST",
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //   },
  //   //   body: JSON.stringify(cartItems),
  //   // });

  //   // if (response.status !== 200) {
  //   //   toast.error(`Failed to Proceed because of ${response.status}`);
  //   //   return;
  //   // }

  //   // const data = await response.json();
  //   const url = await createCheckout(
  //     items.map((item) => {
  //       return {
  //         id: String(item.id),
  //         title: item.nombre,
  //         unit_price: item.precio,
  //         quantity: item.cantidad,
  //       };
  //     }),
  //     "marcosgaliano96@gmail.com"
  //   );
  //   console.log("url", url);

  //   toast.loading("Redirecting...");
  //   if (url) window.location.href = url;
  //   // stripe.redirectToCheckout({ sessionId: data.id });
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end !bg-black/30">
      <div className="cart-container !max-w-lg !w-full !h-screen !min-h-screen !bg-white !shadow-lg !border !border-gray-100 !p-6 relative mt-0 mr-0 flex flex-col overflow-y-auto">
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
          <div className="empty-cart flex flex-col items-center justify-center py-16">
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

        <div className="product-container !mb-4 flex-1 overflow-y-auto">
          {items.length >= 1 &&
            items.map((item, index) => <ItemCart {...item} key={index} />)}
        </div>
        {items.length >= 1 && (
          <div className="cart-bottom !pt-4 border-t border-gray-100 shrink-0 bg-white sticky bottom-0 left-0 right-0 z-10">
            <div className="total flex justify-between items-center mb-4">
              <h3 className="text-base text-gray-600">Subtotal:</h3>
              <h3 className="text-lg font-bold text-[#222]">${subtotal}</h3>
            </div>
            <div className="w-fit !m-auto mb-4">
              <Promotions total={getSubtotal()}/>
            </div>
            <div className="btn-container flex justify-center">
              <Link href={'/checkout'} onClick={()=> setShowCart(false)}>
                <button type="button" className="btn !bg-[#f02d34] !text-white !rounded-full !px-8 !py-3 !shadow-md hover:!bg-[#c81c22] transition-colors text-lg font-semibold">
                  Pagar ahora
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
