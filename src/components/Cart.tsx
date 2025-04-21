"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { AiOutlineLeft, AiOutlineShopping } from "react-icons/ai";

import toast from "react-hot-toast";

import { useCartStore } from "@/store";

import { ItemCart } from "./ItemCart";

export const Cart = () => {
  const cartRef = useRef(null);
  const { items, setShowCart } = useCartStore((state) => state);
  const subtotal = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  );

  const handleCheckout = async () => {
    // const stripe = await getStripe();

    // const response = await fetch("/api/stripe", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(cartItems),
    // });

    // if (response.status !== 200) {
    //   toast.error(`Failed to Proceed because of ${response.status}`);
    //   return;
    // }

    // const data = await response.json();

    toast.loading("Redirecting...");

    // stripe.redirectToCheckout({ sessionId: data.id });
  };

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
              <button type="button" className="btn" onClick={handleCheckout}>
                Pagar ahora
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
