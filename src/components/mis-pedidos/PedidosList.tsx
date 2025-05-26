"use client";

import { useState } from "react";
import { getMisPedidos } from "@/actions"; // server action importada
import { useSession } from "next-auth/react";
import { PedidoCard } from "./PedidoCard";

type Pedido = Awaited<ReturnType<typeof getMisPedidos>>[number];

export default function PedidosList({
  initialPedidos,
}: {
  initialPedidos: Pedido[];
}) {
  const [pedidos, setPedidos] = useState(initialPedidos);
  const [cargando, setCargando] = useState(false);
  const [fin, setFin] = useState(false);
  const session = useSession();
  async function cargarMas() {
    if (session.status !== "authenticated" || !session.data.user.email) return;
    setCargando(true);
    const nuevos = await getMisPedidos({
      skip: pedidos.length,
      take: 10,
      email: session.data?.user.email,
    });
    if (nuevos.length === 0) setFin(true);
    setPedidos((prev) => [...prev, ...nuevos]);
    setCargando(false);
  }

  if (pedidos.length === 0) {
    return (
      <p className="text-gray-600">Todavía no realizaste ningún pedido.</p>
    );
  }

  return (
    <>
      <ul className="!space-y-6">
        {pedidos.map((pedido) => (
          <PedidoCard key={pedido.id} {...pedido} />
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
