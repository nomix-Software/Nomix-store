import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getMisPedidos } from "@/actions";
import PedidosList from "@/components/mis-pedidos/PedidosList";

export default async function MisPedidosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return notFound();

  const pedidosIniciales = await getMisPedidos({ skip: 0, take: 10 });

  return (
    <main className="max-w-4xl mx-auto !p-2 sm:!p-6">
      <h1 className="text-3xl font-bold !mb-6 text-[#324d67]">Mis pedidos</h1>
      <PedidosList initialPedidos={pedidosIniciales} />
    </main>
  );
}
