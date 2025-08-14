
'use client'
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Card } from "@/components/ui/Card";
import { createPromocion } from "@/actions";

export default function NuevaPromocionPage() {
  const [descripcion, setDescripcion] = useState("");
  const [descuento, setDescuento] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, startTransition] = useTransition();
  const [serverError, setServerError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/auth/login");
    } else if (session.user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    const newErrors: { [key: string]: string } = {};
    if (!descripcion) newErrors.descripcion = "La descripción es obligatoria.";
    if (!descuento || isNaN(Number(descuento)) || Number(descuento) <= 0) newErrors.descuento = "El descuento debe ser mayor a 0.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    startTransition(async () => {
      try {
        await createPromocion({ descripcion, descuento: Number(descuento) });
        toast.success("Promoción creada correctamente");
        setDescripcion("");
        setDescuento("");
        setTimeout(() => {
          router.push("/dashboard/promociones");
        }, 1200);
      } catch (err: unknown) {
        const errorMessage = (err && typeof err === "object" && "message" in err) ? (err as { message?: string }).message : undefined;
        toast.error(errorMessage || "Error al crear la promoción");
        setServerError(errorMessage || "Error al crear la promoción");
      }
    });
  };

  return (
    <div className="!p-6 max-w-xl !mx-auto">
      <div className="mb-4">
        <Link href="/dashboard/promociones" className="!text-[#f02d34] underline cursor-pointer hover:text-[#d9292e] transition-colors">← Volver a promociones</Link>
      </div>
      <Card className="!p-8">
        <h1 className="text-2xl font-bold mb-6 text-[#324d67]">Nueva Promoción</h1>
  <form onSubmit={handleSubmit} className="space-y-2">
          <TextField
            name="descripcion"
            label="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            errors={errors}
            required
            placeholder="Ej: 2x1 en productos seleccionados"
            className="!mb-2"
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
            className="!mb-2"
          />
          {serverError && <div className="text-red-600 text-sm mb-2">{serverError}</div>}
          <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={loading}>
            {loading ? "Creando..." : "Crear promoción"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
