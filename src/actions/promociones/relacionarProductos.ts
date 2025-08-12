"use server";
import prisma from "@/lib/prisma";

interface RelacionarProductosInput {
  promocionId: number;
  productoIds: number[];
}

export async function relacionarProductos({ promocionId, productoIds }: RelacionarProductosInput) {
  if (!promocionId || !Array.isArray(productoIds)) {
    throw new Error("Datos inválidos para relacionar productos");
  }
  // Primero, desasociar todos los productos de esta promoción
  await prisma.producto.updateMany({
    where: { promocionId },
    data: { promocionId: null },
  });
  // Luego, asociar los productos seleccionados
  if (productoIds.length > 0) {
    await prisma.producto.updateMany({
      where: { id: { in: productoIds } },
      data: { promocionId },
    });
  }
  return true;
}
