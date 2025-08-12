
'use client';
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import toast from "react-hot-toast";
import { getPromocionById, updatePromocion, deletePromocion } from "@/actions";

export default function EditarPromocionPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [descripcion, setDescripcion] = useState("");
  const [descuento, setDescuento] = useState("");
  const [error, setError] = useState("");
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    async function fetchPromocion() {
      try {
        const promo = await getPromocionById(id);
        if (promo) {
          setDescripcion(promo.descripcion);
          setDescuento(promo.descuento.toString());
        }
      } catch {
        toast.error("No se pudo cargar la promoción");
      }
    }
    if (id) fetchPromocion();
  }, [id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!descripcion || Number(descuento) <= 0) {
      setError("Completa todos los campos correctamente.");
      return;
    }
    startTransition(async () => {
      try {
        await updatePromocion({ id, descripcion, descuento: Number(descuento) });
        toast.success("Promoción actualizada correctamente");
        setTimeout(() => {
          router.push("/dashboard/promociones");
        }, 1200);
      } catch (err: any) {
        toast.error(err?.message || "Error al actualizar la promoción");
      }
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar esta promoción?")) return;
    startTransition(async () => {
      try {
        await deletePromocion(id);
        toast.success("Promoción eliminada correctamente");
        setTimeout(() => {
          router.push("/dashboard/promociones");
        }, 1200);
      } catch (err: any) {
        toast.error(err?.message || "Error al eliminar la promoción");
      }
    });
  };

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
          <div className="flex gap-2 mt-4">
            <Button type="submit" className="!rounded-2xl !py-2.5 !px-4 !bg-[#f02d34] !text-white hover:!scale-110 transition-transform duration-300 cursor-pointer" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
            <Button type="button" onClick={handleDelete} className="!rounded-2xl !py-2.5 !px-4 !bg-red-600 !text-white hover:!scale-110 transition-transform duration-300 cursor-pointer" disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar promoción"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
