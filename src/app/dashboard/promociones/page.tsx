import Link from "next/link";

export default function PromocionesDashboardPage() {
  return (
    <div className="!p-6">
      <div className="flex items-center justify-between !mb-6">
        <h1 className="text-2xl font-bold">Promociones</h1>
  <Link href="/dashboard/promociones/nueva" className="!bg-[#f02d34] !text-white !rounded-2xl !py-2.5 !px-4 hover:!scale-110 transition-transform duration-300">Nueva Promoción</Link>
      </div>
      {/* Aquí irá el listado de promociones */}
  <div className="bg-white !rounded-2xl shadow p-4">
        <p className="text-gray-500">No hay promociones registradas aún.</p>
      </div>
    </div>
  );
}
