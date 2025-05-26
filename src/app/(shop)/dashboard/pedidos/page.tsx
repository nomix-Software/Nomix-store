"use client";

import { useState, FormEvent, useEffect } from "react";
// import { markPedidoEntregado } from "@/actions/markPedidoEntregado"; // Simulado más abajo
import { MdSearch } from "react-icons/md";
import { getMisPedidos,  Pedido  } from "@/actions";
import { useSession } from "next-auth/react";
import { PedidoCard } from "@/components";

export default function PedidosPage() {
  const [pedidoId, setPedidoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);
  const session = useSession();
  useEffect(() => {
    (async () => {
      if (session.status !== "authenticated" || !session.data.user.email)
        return;
      setLoading(true)
      const misPedidos = await getMisPedidos({
        skip: 0,
        take: 30,
        email: session.data.user.email,
      });
          if(misPedidos.length === 0) setStatusMessage('No se encontraron resultados')

      setPedidos(misPedidos);
      setLoading(false)
    })();
  }, [session.status]);

  const handleSubmit = async (e: FormEvent) => {
    if(!session.data?.user.email) return
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");
    const result = await getMisPedidos({ pedidoId:Number(pedidoId.trim()), skip:0, take:30, email: session.data?.user.email});
    if(result.length === 0) setStatusMessage('No se encontraron resultados')
    setPedidos(result);
    setLoading(false);
  };


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
      { !loading && pedidos?.map((pedido) => (
        <PedidoCard key={pedido.id} {...pedido} />
      ))}
      {statusMessage && (
        <p className="!mt-4 text-green-700 font-medium">{statusMessage}</p>
      )}

    </div>
  );
}
