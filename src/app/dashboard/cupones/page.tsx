"use client";
import { Suspense, useEffect, useState } from "react";
import { FaTicketAlt } from "react-icons/fa";
import { TextField } from "@/components";
import toast from "react-hot-toast";
import { createCupon, getAllCupons, deleteCupon } from "@/actions";
import type { GetAllCuponsResponse } from "@/actions/discount-coupons/getAllCupons";

 function CuponesPage() {
  const [cupon, setCupon] = useState("");
  const [descuento, setDescuento] = useState(0);
  const [validoHasta, setValidoHasta] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cupones, setCupones] = useState<GetAllCuponsResponse>([]);
  const [loading, setLoading] = useState(false);

  const fetchCupones = async () => {
    const data = await getAllCupons();
    setCupones(data);
  };

  // Cargar cupones al montar
  useEffect(() => {
    fetchCupones();
  },[]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createCupon({ codigo: cupon, porcentaje: descuento, validoHasta: new Date(validoHasta), descripcion });
    setLoading(false);
    if (res.status === "success") {
      toast.success("Cupón creado");
      setCupon("");
      setDescuento(0);
      setValidoHasta("");
      setDescripcion("");
      fetchCupones();
    } else {
      toast.error(res.message || "Error al crear cupón");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar cupón?")) return;
    setLoading(true);
    const res = await deleteCupon(id);
    setLoading(false);
    if (res.status === "success") {
      toast.success("Cupón eliminado");
      fetchCupones();
    } else {
      toast.error(res.message || "Error al eliminar cupón");
    }
  };

  return (
    <div className="max-w-2xl !mx-auto !p-4">
      <h1 className="!text-3xl !font-extrabold !flex !items-center !gap-2 !mb-6 !text-[#324d67]">
        <FaTicketAlt /> Cupones de descuento
      </h1>
      <form
        onSubmit={handleSubmit}
        className="!bg-white !rounded-2xl !shadow-sm !border !border-gray-100 !w-full !px-4 !py-6 sm:!px-8 sm:!py-8 !space-y-4 !mb-8"
      >
        <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-4">
          <div>
            <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">Código</label>
            <TextField
              name="codigo"
              type="text"
              value={cupon}
              onChange={e => setCupon(e.target.value.toUpperCase())}
              className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
              required
            />
          </div>
          <div>
            <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">Descuento (%)</label>
            <TextField
              name="porcentaje"
              type="number"
              value={descuento.toString()}
              min={1}
              max={100}
              onChange={e => setDescuento(Number(e.target.value))}
              className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
              required
            />
          </div>
          <div>
            <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">Válido hasta</label>
            <TextField
              name="validoHasta"
              type="date"
              value={validoHasta}
              onChange={e => setValidoHasta(e.target.value)}
              className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
              required
            />
          </div>
          <div>
            <label className="!block !text-sm !font-medium !text-gray-700 !mb-1">Descripción</label>
            <TextField
              name="descripcion"
              type="text"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="!mt-1 !block !w-full !border !border-gray-200 !rounded-full !shadow-sm !p-3 !text-base !text-gray-800 !placeholder-gray-400 focus:!border-[#f02d34] focus:!ring-2 focus:!ring-[#f02d34]/20 !outline-none !bg-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="!w-full !bg-[#f02d34] !text-white !p-3 !rounded-full !font-semibold !text-base !shadow-sm hover:!bg-[#d12a2f] !transition disabled:!opacity-60 disabled:!cursor-not-allowed !mt-2"
          disabled={loading}
        >
          Guardar cupón
        </button>
      </form>
      <div className="!bg-white !rounded-2xl !shadow-sm !border !border-gray-100 !w-full !px-4 !py-6 sm:!px-8 sm:!py-8">
        <h2 className="!text-xl !font-bold !mb-4">Cupones existentes</h2>
        <ul className="!divide-y !divide-gray-100">
          {cupones.length === 0 && <li className="!py-4 !text-gray-500">No hay cupones cargados.</li>}
          {cupones.map((c) => (
            <li key={c.id} className="!flex !items-center !justify-between !py-3">
              <div>
                <span className="!font-mono !text-lg !text-[#324d67]">{c.codigo}</span>
                <span className="!ml-4 !text-gray-700 !font-semibold">{c.porcentaje}%</span>
                {c.descripcion && <span className="!ml-4 !text-gray-500">{c.descripcion}</span>}
                {c.validoHasta && <span className="!ml-4 !text-xs !text-gray-400">Válido hasta: {new Date(c.validoHasta).toLocaleDateString()}</span>}
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="!text-red-500 hover:!text-red-700 !text-sm !font-medium"
                disabled={loading}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <Suspense fallback={<div>Cargando cupones...</div>}>
      <CuponesPage />
    </Suspense>
  );
}
export default Page;