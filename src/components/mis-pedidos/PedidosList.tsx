"use client";

import { useState } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import { getMisPedidos } from "@/actions"; // server action importada

type Pedido = Awaited<ReturnType<typeof getMisPedidos>>[number];

export default function PedidosList({ initialPedidos }: { initialPedidos: Pedido[] }) {
  const [pedidos, setPedidos] = useState(initialPedidos);
  const [cargando, setCargando] = useState(false);
  const [fin, setFin] = useState(false);

  async function cargarMas() {
    setCargando(true);
    const nuevos = await getMisPedidos({ skip: pedidos.length, take: 10 });
    if (nuevos.length === 0) setFin(true);
    setPedidos((prev) => [...prev, ...nuevos]);
    setCargando(false);
  }

  if (pedidos.length === 0) {
    return <p className="text-gray-600">Todavía no realizaste ningún pedido.</p>;
  }

  return (
    <>
      <ul className="space-y-6">
        {pedidos.map((pedido) => (
          <li key={pedido.id} className="border border-gray-200 rounded-2xl !p-4 shadow-sm">
            <div className="flex items-center justify-between !mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Pedido #{pedido.id}</h2>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600">
                {pedido.estado === "Entregado" ? (
                  <>
                    <FaCheckCircle className="text-green-500" />
                    Entregado
                  </>
                ) : (
                  <>
                    <FaClock className="text-yellow-500" />
                    {pedido.estado}
                  </>
                )}
              </span>
            </div>

            <p className="text-sm text-gray-500 !mb-4">
              Fecha: {new Date(pedido.fecha).toLocaleDateString()}
            </p>

            <ul className="divide-y divide-gray-100">
              {pedido.productos.map((item) => (
                <li key={item.id} className="!py-2 flex items-center gap-4">
                  <img
                    src={item.imagenUrl || "/placeholder.png"}
                    alt={item.nombre}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                    <p className="text-sm text-gray-500">{item.descripcion}</p>
                    <p className="text-sm text-gray-700 !mt-1">
                      {item.cantidad} x ${item.precioUnitario.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="text-right !mt-4 font-semibold text-gray-800">
              Total: ${pedido.total.toFixed(2)}
            </div>
          </li>
        ))}
      </ul>

      {!fin && (
        <div className="text-center !mt-6">
          <button
            onClick={cargarMas}
            disabled={cargando}
            className=" text-red-600 !p-2 rounded-2xl hover:text-red-700 cursor-pointer hover:underline"
          >
            {cargando ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </>
  );
}
