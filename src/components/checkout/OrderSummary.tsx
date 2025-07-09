"use client";

import { useCartStore } from "@/store";
import Image from "next/image";
import { useState } from "react";

interface OrderSummaryProps {
  costoEnvio?: number;
  totalFinal?: number;
  tipoEntrega?: "ENVIO" | "RETIRO";
  descuento?: number;
  cupon?: { codigo: string; porcentaje: number } | null;
}

export default function OrderSummary({
  costoEnvio = 0,
  totalFinal,
  tipoEntrega,
  descuento = 0,
  cupon = null,
}: OrderSummaryProps) {
  const [abierto, setAbierto] = useState(false);
  const products = useCartStore((state) => state.items);
  const total = products.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="!border !rounded-2xl !p-4 !bg-white !shadow-sm !mb-6">
      <div className="!flex !justify-between !items-center">
        <h2 className="!text-xl !font-bold !text-gray-800">
          Resumen del pedido
        </h2>
        <button
          type="button"
          onClick={() => setAbierto(!abierto)}
          className="!text-[#f02d34] !underline !cursor-pointer !font-medium hover:!text-[#d12a2f] !transition"
        >
          {abierto ? "Ocultar detalles" : "Ver detalles"}
        </button>
      </div>
      <div className="!mt-2 !space-y-1">
        <p className="!text-gray-700">
          Subtotal: <span className="!font-bold">${total.toFixed(2)}</span>
        </p>
        {tipoEntrega === "ENVIO" && costoEnvio > 0 && (
          <p className="!text-gray-700">
            Envío: <span className="!font-bold">${costoEnvio.toFixed(2)}</span>
          </p>
        )}
        {cupon && descuento > 0 && (
          <p className="!text-green-700">
            Cupón{" "}
            <span className="!font-bold">{cupon.codigo}</span> aplicado:-
            {cupon.porcentaje}% (-${descuento.toFixed(2)})
          </p>
        )}
        <p className="!text-gray-800 !font-bold !text-lg">
          Total: $
          {typeof totalFinal === "number"
            ? totalFinal.toFixed(2)
            : total.toFixed(2)}
        </p>
      </div>
      {abierto && products.length > 0 && (
        <ul className="!mt-4 !space-y-3">
          {products.map((producto) => (
            <li
              key={producto.id}
              className="!flex !justify-between !items-start !border-t !pt-3 first:!border-none first:!pt-0"
            >
              <div className="!flex !flex-row !gap-2 !items-center">
                <Image
                  src={producto.imagen}
                  width={70}
                  height={70}
                  alt={`Imagen de ${producto.nombre}`}
                  className="!rounded-xl !border !border-gray-100 !shadow-sm"
                />
                <div>
                  <p className="!font-medium !text-[#324d67]">{producto.nombre}</p>
                  <p className="!text-sm !text-gray-600">
                    Cantidad: {producto.cantidad} × ${producto.precio.toFixed(2)}
                  </p>
                </div>
              </div>
              <p className="!font-bold !text-gray-800">
                ${(producto.precio * producto.cantidad).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
