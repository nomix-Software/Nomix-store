"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import { Sidebar } from "./Sidebar";
import { Cart } from "./Cart";
import { useCartStore } from "@/store";
import SearchBar from "./ui/SearchBar";
import { CollapsibleFilterList } from "./ui/CollapsibleFilterList";
import { useRouter, useSearchParams } from "next/navigation";
import Avatar from "./ui/Avatar";


export const Navbar = () => {
  const { setShowCart, showCart, items } = useCartStore((state) => state);
  const searchParams =useSearchParams()
  const router = useRouter()
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white  !px-6 !py-3 flex justify-center items-center !mb-4">
      <p className="logo">
        <Link href="/">
          <strong>CYE TECH</strong> Tienda
        </Link>
      </p>
              <div className="!flex-grow !flex !justify-center">
          <div className="!hidden sm:!block !w-full !max-w-md lg:!max-w-lg">

              <CollapsibleFilterList
                items={[]}
                size='small'
                title="Categorías"
                openDefault={false} // Abierto por defecto
                onSelect={(label) => {
                  const search = new URLSearchParams(searchParams.toString());
                  search.set("categorie", label);
                  router.push(`/catalogo?${search.toString()}`);
                }}
              />
          </div>
          </div>
        <div className="!flex-grow !flex !justify-center">
          <div className="!hidden sm:!block !w-full !max-w-md lg:!max-w-lg">
            <Suspense fallback={<div className="!h-10 !w-full !bg-gray-200 !rounded-full !animate-pulse" />}>
              <SearchBar size="small" />
            </Suspense>
          </div>
        </div>
      <div className="w-22 sm:!w-25 flex justify-between  ">
        <div className="hidden sm:!block">
        <Avatar email="?" />
        </div>
        <button
          type="button"
          className="cart-icon"
          onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping  size={30}/>
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