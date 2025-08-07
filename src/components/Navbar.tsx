"use client";
import React, { Suspense, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { Cart } from "./Cart";
import { useCartStore } from "@/store";
import SearchBar from "./ui/SearchBar";
import { CollapsibleFilterList } from "./ui/CollapsibleFilterList";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useProducts } from "@/hooks";
import Image from "next/image";
import Avatar from "./ui/Avatar";

const NavbarContent: React.FC = () => {
  const { setShowCart, showCart, items } = useCartStore((state) => state);
  const { productos } = useProducts("/api/products");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data } = useSession();
  const role = data?.user.role;
  // Handler para la selección de categoría para mantener el JSX más limpio
  const handleCategorySelect = (label: string) => {
    const search = new URLSearchParams(searchParams.toString());
    search.set("categorie", label);
    router.push(`/catalogo?${search.toString()}`);
  };

  // Scroll: ocultar niveles 2 y 3 al bajar, mostrar al subir y llegar al tope
  const [showMobileLevels, setShowMobileLevels] = useState(true);
  React.useEffect(() => {
    let lastScroll = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (window.innerWidth >= 768) return; // solo mobile
      if (y <= 0) {
        setShowMobileLevels(true);
      } else if (y > lastScroll) {
        setShowMobileLevels(false);
      } else if (y < lastScroll) {
        if (y <= 0) setShowMobileLevels(true);
        else setShowMobileLevels(true);
      }
      lastScroll = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Estado para saber si el dropdown de categorías está abierto en mobile
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    // Usamos <nav> por semántica y `justify-between` para espaciar las secciones.
    // Añadí una sombra sutil (`shadow-md`) para una mejor separación visual.
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      {/* Nivel superior: branding+acciones (mobile y desktop) */}
      <div className="flex items-center justify-between !px-4 md:!px-12 !py-2 h-14 md:h-16 relative">
        {/* Branding a la izquierda */}
        <div className="flex items-center !gap-2 min-w-0 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <Image
              src="/images/logo.png"
              priority
              width={32}
              height={32}
              alt="Logo"
              className="h-9 w-9 object-contain"
            />
            <span className="text-xl md:text-2xl font-bold text-[#324d67] truncate">
              CYE TECH
            </span>
          </Link>
        </div>
        {/* SearchBar solo en desktop */}
        <div className="hidden md:flex justify-center items-center !px-2  w-2/3 ">
          <Suspense
            fallback={
              <div className="h-10 w-full max-w-[400px] bg-gray-200 rounded-full animate-pulse" />
            }
          >
            <SearchBar size="small" path={"/catalogo"} />
          </Suspense>
        </div>
        {/* Acciones a la derecha */}
        <div className="flex items-center !gap-5 flex-shrink-0">
                    <button
            type="button"
            className="cart-icon animate-bounce-cart"
            onClick={() => {
              if (!role) {
                router.push(
                  `/auth/login?redirect_uri=${encodeURIComponent(
                    window.location.pathname
                  )}`
                );
              } else {
                setShowCart(true);
              }
            }}
          >
            <span>
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#324d67"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6h15l-1.5 9h-13z" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M6 6V4a2 2 0 0 1 2-2h2" />
              </svg>
            </span>
            <span className="cart-item-qty">{items.length}</span>
          </button>
          {data?.user.email ? (
            <Sidebar
              role={role ? role : "GUEST"}
              email={data?.user.email || ""}
              cartItems={items.length}
              showCartIcon
              mobile={true}
            />
          ) : (
            <button
              className="!cursor-pointer text-2xl text-[#324d67] hover:text-gray-400 transition-colors duration-300"
              onClick={() =>
                router.push(
                  `/auth/login?redirect_uri=${encodeURIComponent(
                    window.location.pathname
                  )}`
                )
              }
            >
              <Avatar email={""} />
            </button>
          )}

        </div>
      </div>

      {/* Nivel medio y nivel inferior solo visibles en mobile y controlados por scroll */}
      <div
        className={clsx(
          "md:!hidden w-full transition-all duration-300",
          showMobileLevels
            ? "opacity-100"
            : "opacity-0 !max-h-0 pointer-events-none",
          !dropdownOpen && "!overflow-hidden"
        )}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        {/* Nivel medio: searchbar solo en mobile */}
        <div className="flex items-center justify-center !px-4 !py-2 bg-white h-14">
          <div className="w-full max-w-md flex justify-center items-center">
            <Suspense
              fallback={
                <div className="h-10 w-full max-w-md bg-gray-200 rounded-full animate-pulse" />
              }
            >
              <SearchBar size="small" path={"/catalogo"} />
            </Suspense>
          </div>
        </div>
        {/* Nivel inferior: tabs scrolleables solo en mobile */}
        <div className="relative w-full bg-white">
          <div
            className="flex !items-center !gap-2 !px-4 !py-2 "
            style={{ WebkitOverflowScrolling: "touch", overflowX: dropdownOpen ? undefined :"auto", overflowY: "visible" }}
          >
            {productos?.filtrosDisponibles?.categorias?.length > 0 && (
              <div
                className="scroll-auto bg-white flex items-center"
                style={{ position: 'relative', zIndex: 50 }}
              >
                <div
                  className="md:!hidden"
                  style={{
                    position: 'relative',
                    zIndex: 100,
                  }}
                >
                  {/* El botón/tab está alineado, pero el dropdown se fuerza a fixed/z-1000 vía prop especial */}
                  <CollapsibleFilterList
                    items={productos.filtrosDisponibles.categorias.map(
                      (cat: { cantidad: number; nombre: string }) => ({ count: cat.cantidad, label: cat.nombre })
                    )}
                    size="small"
                    title="Categorías"
                    openDefault={false}
                    onSelect={handleCategorySelect}
                    changeClose
                    buttonClassName="!px-4 !py-1 !h-7.5 !text-sm cursor-pointer !rounded-full !border !border-gray-300 !bg-gray-50 hover:!bg-gray-200 !font-medium !transition-colors !flex !items-center !text-[#324d67] !whitespace-nowrap"
                    // Levantar estado open
                    onOpen={() => setDropdownOpen(true)}
                    onClose={() => setDropdownOpen(false)}
                  />
                </div>
                <div className="hidden md:block">
                  <CollapsibleFilterList
                    items={productos.filtrosDisponibles.categorias.map(
                      (cat: { cantidad: number; nombre: string }) => ({ count: cat.cantidad, label: cat.nombre })
                    )}
                    size="small"
                    title="Categorías"
                    openDefault={false}
                    onSelect={handleCategorySelect}
                    changeClose
                  />
                </div>
              </div>
            )}
            {[
              { label: "Catálogo", href: "/catalogo" },
              { label: "Ofertas", href: "/ofertas" },
              { label: "Ayuda", href: "/ayuda" },
            ].map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="!px-4 !py-1 !h-7.5 !text-sm cursor-pointer !rounded-full !border !border-gray-300 !bg-gray-50 hover:!bg-gray-200 !font-medium !transition-colors !flex !items-center !text-[#324d67] !whitespace-nowrap"
              >
                {tab.label}
              </Link>
            ))}
            {/* Fade para indicar scroll a la derecha */}
            {/* <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent" /> */}
          </div>
        </div>
      </div>
      {/* DESKTOP: tabs centrados y searchbar siempre visibles */}
      <div className="hidden md:!block">
        {/* DESKTOP: tabs centrados */}
        <div className="hidden md:!flex items-center justify-center !gap-x-4 !px-8 !py-2 !bg-white">
          {productos?.filtrosDisponibles?.categorias?.length > 0 && (
            <CollapsibleFilterList
              items={productos.filtrosDisponibles.categorias.map(
                (cat: { cantidad: number; nombre: string }) => ({ count: cat.cantidad, label: cat.nombre })
              )}
              size="small"
              title="Categorías"
              openDefault={false}
              onSelect={handleCategorySelect}
              changeClose
            />
          )}
          {[
            { label: "Catálogo", href: "/catalogo" },
            { label: "Ofertas", href: "/ofertas" },
            { label: "Ayuda", href: "/ayuda" },
          ].map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="!px-4 !py-1 !h-7.5 !text-sm cursor-pointer !rounded-full !border !border-gray-300 !bg-gray-50 hover:!bg-gray-200 !font-medium !transition-colors !flex !items-center !text-[#324d67]"
            >
              {tab.label}
            </Link>
          ))}
        </div>
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
