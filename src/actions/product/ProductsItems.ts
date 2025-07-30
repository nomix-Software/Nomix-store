"use server";

import prisma from "@/lib/prisma";

interface getProductsArgs { 
  take?: number;
  skip?: number;
}
export const getProducts = async (args: getProductsArgs) => {
  const productos = await prisma.producto.findMany({
    take: args.take || 10,
    skip: args.skip || 0,
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

  // Transformar al formato deseado
  return productos.map((p) => ({
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
