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
    <div className="fixed top-0 left-0 w-full z-50 bg-white  !px-6 !py-3 flex justify-between items-center !mb-4">
      <p className="logo">
        <Link href="/">
          <strong>CYE TECH</strong> Tienda
        </Link>
      </p>
      <div className="w-20 flex justify-between ">
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
      {showCart && (
        <Suspense fallback={<div>Cargando carrito...</div>}>
          <Cart />
        </Suspense>
      )}
    </div>
  );
};