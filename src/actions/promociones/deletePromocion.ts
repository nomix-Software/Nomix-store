"use server";
import prisma from "@/lib/prisma";

export async function deletePromocion(id: number) {
  if (!id) throw new Error("ID requerido");
  await prisma.promocion.delete({ where: { id } });
  return true;
}
