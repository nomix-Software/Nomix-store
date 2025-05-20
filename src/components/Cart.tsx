"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { AiOutlineLeft, AiOutlineShopping } from "react-icons/ai";

// import toast from "react-hot-toast";

import { useCartStore } from "@/store";

import { ItemCart } from "./ItemCart";
// import { createCheckout } from "@/actions";

export const Cart = () => {
  const cartRef = useRef(null);
  const { items, setShowCart } = useCartStore((state) => state);
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
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Tu carrito</span>
          <span className="cart-num-items">({items.length} items)</span>
        </button>

        {items.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Tu carrito está vacío </h3>
            <Link href="/" onClick={() => setShowCart(false)}>
              <button
                type="button"
                // onClick={() => setShowCart(false)}
                className="btn"
              >
                Continuar comprando
              </button>
            </Link>
          </div>
        )}

        <div className="product-container">
          {items.length >= 1 &&
            items.map((item, index) => <ItemCart {...item} key={index} />)}
        </div>
        {items.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${subtotal}</h3>
            </div>
            <div className="btn-container">
              <Link href={'/checkout'}>
              <button type="button" className="btn" >
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
