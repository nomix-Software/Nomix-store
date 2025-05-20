"use client";

import { useCartStore } from "@/store";
import Image from "next/image";
import { useState } from "react";

export default function OrderSummary() {
  const [abierto, setAbierto] = useState(false);
  const products = useCartStore((state) => state.items);
  const total = products.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="border rounded-2xl !p-4 shadow-md bg-red-50">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Resumen del pedido</h2>
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          className="text-red-600 underline cursor-pointer"
        >
          {abierto ? "Ocultar detalles" : "Ver detalles"}
        </button>
      </div>

      <div className="!mt-2">
        <p className="text-gray-700">
          Total: <span className="font-bold">${total.toFixed(2)}</span>
        </p>
      </div>

      {abierto && products.length > 0 && (
        <ul className="!mt-4 !space-y-3">
          {products.map((producto) => (
            <li
              key={producto.id}
              className="flex justify-between items-start border-t !pt-3 first:border-none first:!pt-0"
            >
              <div className="flex flex-row gap-2 items-center">
                <Image
                  src={producto.imagen}
                  width={70}
                  height={70}
                  alt={`Imagen de ${producto.nombre}`}
                />
                <div>
                  <p className="font-medium text-[#324d67]">
                    {producto.nombre}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {producto.cantidad} × $
                    {producto.precio.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="font-bold text-gray-800">
                ${(producto.precio * producto.cantidad).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
