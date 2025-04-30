// app/actions/getMostSoldProduct.ts
"use server";

import prisma from "@/lib/prisma";

export async function getProductMostSale() {
  const topProduct = await prisma.ventaProducto.groupBy({
    by: ["productoId"],
    _sum: {
      cantidad: true,
    },
    orderBy: {
      _sum: {
        cantidad: "desc",
      },
    },
    take: 1,
  });

  if (topProduct.length === 0) return null;

  const producto = await prisma.producto.findUnique({
    where: {
      id: topProduct[0].productoId,
    },
    include: {
      imagenes: true,
      categoria: true,
      marca: true,
    },
  });

  return producto;
}
