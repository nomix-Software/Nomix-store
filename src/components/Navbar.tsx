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
import { useSession } from "next-auth/react";
import { useProducts } from "@/hooks";

const NavbarContent = () => {
  const { setShowCart, showCart, items } = useCartStore((state) => state);
  const { productos }= useProducts('/api/products')
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data } = useSession();
  const role = data?.user.role
  // Handler para la selección de categoría para mantener el JSX más limpio
  const handleCategorySelect = (label: string) => {
    const search = new URLSearchParams(searchParams.toString());
    search.set("categorie", label);
    router.push(`/catalogo?${search.toString()}`);
  };

  return (
    // Usamos <nav> por semántica y `justify-between` para espaciar las secciones.
    // Añadí una sombra sutil (`shadow-md`) para una mejor separación visual.
    <nav className="fixed top-0 left-0 w-full z-50 bg-white !px-6 !py-3 flex justify-between items-start !mb-4 shadow-md !h-15">
      {/* Sección Izquierda: Logo */}
      <div className="flex items-center !mt-1">
        <p className="logo ">
          <Link href="/">
            <strong className=" text-2xl">CYE TECH</strong> Tienda
          </Link>
        </p>
      </div>

      {/* Sección Central: Búsqueda y Categorías (oculta en móviles) */}
      <div className="hidden sm:flex flex-1 justify-center items-start !gap-x-4 max-w-screen-md">
        <div className="w-full max-w-[220px]">
          <CollapsibleFilterList
            items={productos?.filtrosDisponibles?.categorias.map(cat => { return { count: cat.cantidad, label:cat.nombre}})} // Quizás quieras popular esto con datos
            size="small"
            title="Productos"
            openDefault={false}
            onSelect={handleCategorySelect}
            changeClose
          />
        </div>
        <div className="w-full max-w-md">
          <Suspense fallback={<div className="h-10 w-full bg-gray-200 rounded-full animate-pulse" />}>
            <SearchBar size="small" path={'/catalogo'} />
          </Suspense>
        </div>
      </div>

      {/* Sección Derecha: Acciones */}
      <div className="flex items-center gap-x-4">
        <button
          type="button"
          className="cart-icon"
          onClick={() => setShowCart(true)}
        >
          <AiOutlineShopping size={30} />
          <span className="cart-item-qty">{items.length}</span>
        </button>
        {/* <div className="hidden sm:block">
          <Avatar email="?" />
        </div> */}
        <Sidebar role={role ? role : 'GUEST'} email={data?.user.email || ''}/>
      </div>

      {/* Modal del Carrito */}
      {showCart && (
        <Suspense fallback={<div>Cargando carrito...</div>}>
          <Cart />
        </Suspense>
      )}
    </nav>
  );
};

export default function Navbar() {
  return (
    <Suspense fallback={<div />}>
      <NavbarContent />
    </Suspense>
  );
}