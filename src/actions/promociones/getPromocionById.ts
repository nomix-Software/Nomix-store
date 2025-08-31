"use server";
import prisma from "@/lib/prisma";

export async function getPromocionById(id: number) {
  if (!id) throw new Error("ID requerido");
  return prisma.promocion.findUnique({ where: { id } });
}
