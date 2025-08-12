'use client'
import { useState } from "react";
import Link from "next/link";

// Simulación de datos de promoción
const mockPromocion = {
  id: 1,
  descripcion: "Descuento de verano",
  descuento: 20,
};

export default function EditarPromocionPage() {
  const [descripcion, setDescripcion] = useState(mockPromocion.descripcion);
  const [descuento, setDescuento] = useState(mockPromocion.descuento);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Lógica para editar promoción
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || descuento <= 0) {
      setError("Completa todos los campos correctamente.");
      return;
    }
    setError("");
    setEditSuccess(true);
    // Aquí iría la llamada a la API para editar
  };

  // Lógica para eliminar promoción
  const handleDelete = () => {
    if (confirm("¿Seguro que deseas eliminar esta promoción?")) {
      setDeleted(true);
      // Aquí iría la llamada a la API para eliminar
    }
  };

  if (deleted) {
    return (
      <div className="!p-6 max-w-xl !mx-auto">
        <p className="text-green-700 font-bold !mb-4">Promoción eliminada correctamente.</p>
  <Link href="/dashboard/promociones" className="text-blue-600 hover:underline transition-colors">Volver al listado</Link>
      </div>
    );
  }

  return (
    <div className="!p-6 max-w-xl !mx-auto">
      <div className="mb-4">
  <Link href="/dashboard/promociones" className="!text-[#f02d34] underline cursor-pointer">← Volver a promociones</Link>
      </div>
      <h1 className="text-2xl font-bold !mb-4">Editar Promoción</h1>
  <form onSubmit={handleEdit} className="bg-white !rounded-2xl shadow !p-6 space-y-4">
        <div>
          <label className="block font-medium !mb-1">Descripción</label>
          <input
            type="text"
            className="w-full border rounded !px-3 !py-2"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Descuento (%)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={descuento}
            onChange={e => setDescuento(Number(e.target.value))}
            min={1}
            max={100}
            required
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {editSuccess && <div className="text-green-700">Promoción actualizada correctamente.</div>}
        <div className="flex gap-2">
          <button type="submit" className="!bg-[#f02d34] !text-white !rounded-2xl !py-2.5 !px-4 hover:!scale-110 transition-transform duration-300">Guardar cambios</button>
          <button type="button" onClick={handleDelete} className="!bg-red-600 !text-white !rounded-2xl !py-2.5 !px-4 hover:!scale-110 transition-transform duration-300">Eliminar promoción</button>
        </div>
      </form>
    </div>
  );
}
