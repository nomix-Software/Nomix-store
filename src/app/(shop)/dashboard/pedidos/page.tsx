"use client";

import { useState, FormEvent } from "react";
// import { markPedidoEntregado } from "@/actions/markPedidoEntregado"; // Simulado más abajo
import { MdSearch, MdCheckCircle } from "react-icons/md";
import { getPedidoById } from "@/actions";

export default function PedidosPage() {
  const [pedidoId, setPedidoId] = useState("");
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");
    const result = await getPedidoById(Number(pedidoId.trim()));
    setPedido(result);
    setLoading(false);
  };

  const handleEntregar = async () => {
    if (!pedido) return;
    setLoading(true);
    // await markPedidoEntregado(pedido.id); // Simulado
    setPedido({ ...pedido, estado: "entregado" });
    setStatusMessage("✅ Pedido marcado como entregado.");
    setLoading(false);
  };
 function dateFormate(fechaStr: string): string {
  const fecha = new Date(fechaStr);

  const opciones: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  // Formatea en español
  return fecha.toLocaleDateString('es-ES', opciones);
}

  return (
    <div className="max-w-2xl !mx-auto !p-6">
      <h1 className="text-2xl font-bold !mb-4">Buscar pedido</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 !mb-6">
        <input
          type="number"
          placeholder="ID del pedido"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
          className="flex-1 !px-4 !py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="flex items-center gap-2 !px-4 !py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          <MdSearch />
          Buscar
        </button>
      </form>

      {loading && <p className="text-gray-500">Cargando...</p>}

      {pedido && (
        <div className="border !p-4 rounded-lg shadow-md bg-white !space-y-4">
          <h2 className="text-lg font-semibold">Pedido #{pedido.id}</h2>
          <p><strong>Fecha de compra:</strong> {dateFormate(pedido.fecha)}</p>
          <p><strong>Cliente:</strong> {pedido.usuario.email}</p>
          <p><strong>Estado:</strong> <span className={pedido.estado.nombre === "entregado" ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}>{pedido.estado.nombre}</span></p>
          <p><strong>Productos:</strong></p>
          <ul className="list-disc !ml-6">
            {pedido.productos.map((prod: any, i: number) => (
              <li key={i}>
                {prod.producto.nombre} x {prod.cantidad}
              </li>
            ))}
          </ul>
          <p><strong>Metodo de pago:</strong> {pedido.metodoPago.nombre}</p>
          <p><strong>Total:</strong> ${pedido.total}</p>
          {pedido.estado !== "entregado" && (
            <button
              onClick={handleEntregar}
              className="!mt-4 inline-flex items-center gap-2 !px-4 !py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <MdCheckCircle />
              Marcar como entregado
            </button>
          )}
        </div>
      )}

      {statusMessage && (
        <p className="mt-4 text-green-700 font-medium">{statusMessage}</p>
      )}
    </div>
  );
}
