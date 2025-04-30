"use server";

import prisma from "@/lib/prisma";

export async function getLatestProduct() {
  const producto = await prisma.producto.findFirst({
    where: {
      stock: {
        gt: 0, // stock > 0
      },
    },
    orderBy: {
      creadoEn: "desc", // Ordena por fecha de creación más reciente
    },
    include: {
      imagenes: true,
      categoria: true,
      marca: true,
    },
  });

  return producto;
}
