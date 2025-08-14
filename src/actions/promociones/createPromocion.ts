"use server";
import prisma from "@/lib/prisma";

interface CreatePromocionInput {
  descripcion: string;
  descuento: number;
}

export async function createPromocion({ descripcion, descuento }: CreatePromocionInput) {
  if (!descripcion || typeof descuento !== "number" || descuento <= 0) {
    throw new Error("Datos inválidos para crear la promoción");
  }
  const promocion = await prisma.promocion.create({
    data: {
      descripcion,
      descuento,
    },
  });
  return promocion;
}
