"use server";
import prisma from "@/lib/prisma";

export async function getProductosDePromocion(promocionId: number) {
  if (!promocionId) throw new Error("ID de promoción requerido");
  return prisma.producto.findMany({
    where: { promocionId },
    select: {
      id: true,
      nombre: true,
      // Agrega aquí otros campos que quieras mostrar en el colapsable
    },
  });
}
