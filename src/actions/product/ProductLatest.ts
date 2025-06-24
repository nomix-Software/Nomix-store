"use server";

import prisma from "@/lib/prisma";

export async function getLatestProducts() {
  const productos = await prisma.producto.findMany({
    where: {
      stock: {
        gt: 0, // stock > 0
      },
    },
    orderBy: {
      creadoEn: "desc", // Los más recientes primero
    },
    take: 3, // <-- Acá traés los últimos 3
    include: {
      imagenes: true,
      categoria: true,
      marca: true,
    },
  });

  return productos;
}
