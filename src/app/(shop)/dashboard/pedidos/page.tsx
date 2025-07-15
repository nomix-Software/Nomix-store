"use client";

import { useState, FormEvent, useEffect } from "react";
// import { markPedidoEntregado } from "@/actions/markPedidoEntregado"; // Simulado más abajo
import { MdSearch } from "react-icons/md";
import { getMisPedidos,  Pedido  } from "@/actions";
import { useSession } from "next-auth/react";
import { PedidoCard, TextField } from "@/components";

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
    <div className="!p-6 !max-w-3xl !mx-auto">
      <h1 className="!text-3xl !font-extrabold !mb-6 !text-[#324d67] !text-center">
        Buscar pedido
      </h1>

      <form onSubmit={handleSubmit} className="!flex !gap-4 !mb-6 !justify-center">
        <TextField
          type="number"
          name="pedidoId"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
          placeholder="ID del pedido"
          className="!flex-1 !mt-1 !block !w-full !border !border-gray-200 !rounded-2xl !shadow-sm !p-3 !text-base !text-gray-800 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
        />

        <button
          type="submit"
          className="!flex !items-center !gap-2 !bg-[#f02d34] hover:!bg-[#d12a2f] !text-white !rounded-full !px-5 !py-3 !font-semibold !shadow-sm !transition"
        >
          <MdSearch size={20} />
          Buscar
        </button>
      </form>

      {loading && <p className="!text-gray-500 !text-center">Cargando...</p>}

      {!loading && pedidos && pedidos.length > 0 && (
        <div className="!space-y-4">
          {pedidos.map((pedido) => (
            <PedidoCard key={pedido.id} {...pedido} />
          ))}
        </div>
      )}

      {!loading && statusMessage && (
        <p className="!mt-4 !text-center !text-green-700 !font-medium">{statusMessage}</p>
      )}
    </div>
  );
}
