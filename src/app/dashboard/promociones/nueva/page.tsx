'use client'
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export default function NuevaPromocionPage() {
  const [descripcion, setDescripcion] = useState("");
  const [descuento, setDescuento] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Aquí iría la lógica para enviar el formulario a la API
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!descripcion) newErrors.descripcion = "La descripción es obligatoria.";
    if (!descuento || isNaN(Number(descuento)) || Number(descuento) <= 0) newErrors.descuento = "El descuento debe ser mayor a 0.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    // Lógica para crear la promoción
    alert("Promoción creada (simulado)");
  };

  return (
    <div className="!p-6 max-w-xl !mx-auto">
      <div className="!mb-4">
  <Link href="/dashboard/promociones" className="!text-[#f02d34] underline cursor-pointer">← Volver a promociones</Link>
      </div>
      <h1 className="text-2xl font-bold !mb-4">Nueva Promoción</h1>
      <form onSubmit={handleSubmit} className="bg-white !rounded-2xl shadow p-6 space-y-4">
        <TextField
          name="descripcion"
          label="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          errors={errors}
          required
          placeholder="Ej: 2x1 en productos seleccionados"
        />
        <TextField
          name="descuento"
          label="Descuento (%)"
          type="number"
          value={descuento}
          onChange={e => setDescuento(e.target.value)}
          errors={errors}
          required
          min={1}
          max={100}
          placeholder="Ej: 20"
        />
        <Button type="submit" className="w-full mt-2">Crear promoción</Button>
      </form>
    </div>
  );
}
