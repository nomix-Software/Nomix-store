"use server";

import prisma from "@/lib/prisma";

export async function getProductByCategorie(search?: string) {
  const categories = await prisma.categoria.findMany({
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

  return categories.map((cat) => ({
    nombre: cat.nombre,
    cantidad: cat._count.productos,
  }));
}
