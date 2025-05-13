"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { Sidebar } from "./Sidebar";
import { Cart } from "./Cart";
import { useCartStore } from "@/store";

export const Navbar = () => {
  const { setShowCart, showCart, items } = useCartStore((state) => state);
  return (
    <div className="navbar-container !mb-4">
      <p className="logo">
        <Link href="/">
          <strong>CYE TECH</strong> Tienda
        </Link>
      </p>
      <div className="w-15">
        <button
          type="button"
          className="cart-icon"
          onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping />
          <span className="cart-item-qty">{items.length}</span>
        </button>
        <Sidebar role="ADMIN" isAuthenticated={true} />
      </div>
      {showCart && <Suspense fallback={<div>Cargando carrito...</div>}> <Cart /></Suspense>}
    </div>
  );
};
