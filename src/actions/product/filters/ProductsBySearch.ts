"use server";

import prisma from "@/lib/prisma";

export const getProductsBySearch = async (search: string) => {
  const products = await prisma.producto.findMany({
    where: search
      ? {
          nombre: {
            contains: search,
            mode: "insensitive", // para que no sea case-sensitive
          },
        }
      : {},
    take: 30,
    orderBy: {
      nombre: "asc", // o 'createdAt' si tenés ese campo
    },
    select: {
      id: true,
      nombre: true,
      precio: true,
      slug: true,
      stock: true,
      imagenes: {
        select: {
          url: true,
        },
        take: 1, // Solo una imagen por producto
      },
    },
  });
  return products.map((p) => ({
    _id: p.id.toString(),
    image: p.imagenes[0]?.url || "",
    name: p.nombre,
    price: p.precio,
    stock: p.stock,
    slug: {
      current: p.slug,
    },
  }));
};
