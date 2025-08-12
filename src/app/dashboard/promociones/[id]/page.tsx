'use client'
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

// Simulación de datos de promoción
const mockPromocion = {
  id: 1,
  descripcion: "Descuento de verano",
  descuento: 20,
};

export default function EditarPromocionPage() {
  const [descripcion, setDescripcion] = useState(mockPromocion.descripcion);
  const [descuento, setDescuento] = useState(mockPromocion.descuento.toString());
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Lógica para editar promoción
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || Number(descuento) <= 0) {
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
        <Card className="!p-6 flex flex-col items-center">
          <p className="text-green-700 font-bold mb-4">Promoción eliminada correctamente.</p>
          <Link href="/dashboard/promociones" className="text-[#f02d34] underline cursor-pointer hover:text-[#d9292e] transition-colors">Volver al listado</Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="!p-6 max-w-xl !mx-auto">
      <div className="mb-4">
        <Link href="/dashboard/promociones" className="!text-[#f02d34] underline cursor-pointer hover:text-[#d9292e] transition-colors">← Volver a promociones</Link>
      </div>
      <Card className="!p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#324d67]">Editar Promoción</h1>
        <form onSubmit={handleEdit} className="space-y-2">
          <TextField
            name="descripcion"
            label="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
            className="!mb-2"
          />
          <TextField
            name="descuento"
            label="Descuento (%)"
            type="number"
            value={descuento}
            onChange={e => setDescuento(e.target.value)}
            min={1}
            max={100}
            required
            className="!mb-2"
          />
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {editSuccess && <div className="text-green-700 text-sm mb-2">Promoción actualizada correctamente.</div>}
          <div className="flex gap-2 mt-4">
            <Button type="submit" className="!rounded-2xl !py-2.5 !px-4 !bg-[#f02d34] !text-white hover:!scale-110 transition-transform duration-300 cursor-pointer">Guardar cambios</Button>
            <Button type="button" onClick={handleDelete} className="!rounded-2xl !py-2.5 !px-4 !bg-red-600 !text-white hover:!scale-110 transition-transform duration-300 cursor-pointer">Eliminar promoción</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
