import Link from "next/link";
import { getPromociones } from "@/actions";
import { Card } from "@/components/ui/Card";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PromocionesDashboardPage({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const search = typeof params?.q === "string" ? params.q : Array.isArray(params?.q) ? params?.q[0] : undefined;
  const { promociones, totalPages } = await getPromociones({ search, page });
  return (
    <div className="!p-6">
      <div className="flex items-center justify-between !mb-6">
        <h1 className="text-2xl font-bold">Promociones</h1>
        <Link href="/dashboard/promociones/nueva" className="!bg-[#f02d34] !text-white !rounded-2xl !py-2.5 !px-4 hover:!scale-110 transition-transform duration-300">Nueva Promoción</Link>
      </div>
      <div className="!mb-4">
        <SearchBar size="medium" path="/dashboard/promociones" />
      </div>
      <div className="grid !gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promociones.length === 0 ? (
          <Card className="col-span-full text-center !py-8">
            <p className="text-gray-500">No hay promociones registradas aan.</p>
          </Card>
        ) : (
          promociones.map((promo: { id: number; descripcion: string; descuento: number }) => (
            <Card key={promo.id.toString()} className="flex flex-col !gap-2 !p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#324d67]">{promo.descripcion}</span>
                <span className="bg-[#f02d34]/10 text-[#f02d34] font-bold rounded !px-3 !py-1 text-sm">{promo.descuento}%</span>
              </div>
              <div className="flex !gap-2 !mt-2 self-end">
                <Link href={`/dashboard/promociones/${promo.id.toString()}`}>
                  <Button type="button" variant="secondary" className="!px-3 !py-1 !text-xs !rounded-lg cursor-pointer">Editar</Button>
                </Link>
                <Link href={`/dashboard/promociones/${promo.id.toString()}/productos`}>
                  <Button type="button" variant="secondary" className="!px-3 !py-1 !text-xs !rounded-lg cursor-pointer">Productos</Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
      { totalPages > 1 && (
        <div className="flex justify-center !mt-8">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
