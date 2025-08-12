"use client";
import React from "react";
import { useCartStore } from "@/store";
import { MdErrorOutline } from "react-icons/md";

interface ProductDetailBase {
  id: number;
  nombre: string;
  slug: string;
  precio: number;
  stock: number;
  imagenes: { url: string }[];
  precioOriginal?: number;
  descuento?: number;
}
interface Props {
  productDetail: ProductDetailBase;
}

export const AddToCartButton: React.FC<Props> = ({ productDetail }) => {
  const { addToCart, setShowCart, items } = useCartStore();
  const alreadyInCart = items.some((item) => item.id === productDetail.id);

  // Calcular precio con descuento si corresponde
  // @ts-ignore: promocion puede venir de ProductDetails aunque no esté en Props
  const tienePromo = !!(productDetail.promocion && productDetail.promocion.descuento > 0);
  // @ts-ignore
  const precioFinal = tienePromo && productDetail.promocion
    // @ts-ignore
    ? productDetail.precio * (1 - productDetail.promocion.descuento / 100)
    : productDetail.precio;

  if (productDetail.stock <= 0) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-200 text-red-800 text-base font-semibold px-4 py-1.5 mt-6 mx-auto rounded-full mb-4 shadow-sm">
        <MdErrorOutline className="text-xl" />
        Sin stock disponible
      </div>
    );
  }

  if (alreadyInCart) {
    return (
      <button
        type="button"
        className="bg-[#324d67] !cursor-pointer !text-white rounded-2xl !py-2.5 !my-8 !px-4 !w-[170px] m-auto transform transition-transform duration-300 hover:scale-110 !pointer-events-auto"
        onClick={() => setShowCart(true)}
      >
        Ver carrito
      </button>
    );
  }

  return (
    <button
      type="button"
      className="bg-[#f02d34] !cursor-pointer !text-white rounded-2xl !py-2.5 !my-8 !px-4 !w-[170px] m-auto transform transition-transform duration-300 hover:scale-110 !pointer-events-auto"
      onClick={() => {
        addToCart({
          id: productDetail.id,
          nombre: productDetail.nombre,
          slug: productDetail.slug,
          cantidad: 1,
          precio: productDetail.precio,
          stock: productDetail.stock,
          imagen: productDetail.imagenes[0]?.url || "",
          precioOriginal: productDetail.precioOriginal,
          descuento: productDetail.descuento,
        });
      }}
    >
      Agregar al carrito
    </button>
  );
};
