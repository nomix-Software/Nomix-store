"use server";
import prisma from "@/lib/prisma";

interface UpdatePromocionInput {
  id: number;
  descripcion: string;
  descuento: number;
}

export async function updatePromocion({ id, descripcion, descuento }: UpdatePromocionInput) {
  if (!id || !descripcion || typeof descuento !== "number" || descuento <= 0) {
    throw new Error("Datos inválidos para actualizar la promoción");
  }
  const promocion = await prisma.promocion.update({
    where: { id },
    data: {
      descripcion,
      descuento,
    },
  });
  return promocion;
}
