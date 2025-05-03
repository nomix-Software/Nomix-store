"use server";

import prisma from "@/lib/prisma";

export async function getProductsByBrand(search?: string) {
  const marcas = await prisma.marca.findMany({
    where: {
      productos: {
        some: {
          nombre: {
            contains: search ?? "",
            mode: "insensitive",
          },
        },
      },
    },
    select: {
      nombre: true,
      _count: {
        select: {
          productos: {
            where: {
              nombre: {
                contains: search ?? "",
                mode: "insensitive",
              },
            },
          },
        },
      },
    },
  });

  return marcas.map((marca) => ({
    nombre: marca.nombre,
    cantidad: marca._count.productos,
  }));
}
