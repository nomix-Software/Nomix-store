"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { Sidebar } from "./Sidebar";
import { Cart } from "./Cart";
import { useCartStore } from "@/store";
import SearchBar from "./ui/SearchBar";

export const Navbar = () => {
  const { setShowCart, showCart, items } = useCartStore((state) => state);
  return (
    <header className="!fixed !top-0 !left-0 !w-full !z-50 !bg-white/80 backdrop-blur-sm !shadow-md">
      <nav className="!px-4 sm:!px-6 lg:!px-8 !py-2 !flex !items-center !gap-4">
        {/* 1. Logo a la izquierda */}
        <div className="!flex-shrink-0">
          <Link href="/" className="!text-xl !font-bold !text-gray-800">
            CYE TECH
          </Link>
        </div>

        {/* 2. Espacio central para la búsqueda */}
        <div className="!flex-grow !flex !justify-center">
          <div className="!hidden sm:!block !w-full !max-w-md lg:!max-w-lg">
            <Suspense fallback={<div className="!h-10 !w-full !bg-gray-200 !rounded-full !animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        {/* 3. Iconos a la derecha */}
        <div className="!flex !items-center !gap-4">
          <button
            type="button"
            className="cart-icon"
            onClick={() => setShowCart(true)}
          >
            <AiOutlineShopping />
            <span className="cart-item-qty">{items.length}</span>
          </button>
          {/* TODO: Conectar con la sesión real del usuario para pasar los props correctos */}
          <Sidebar role="ADMIN" isAuthenticated={true} />
        </div>
      </nav>
      {showCart && (
        <Suspense fallback={<div>Cargando carrito...</div>}>
          <Cart />
        </Suspense>
      )}
    </header>
  );
};
