"use server";
import prisma from "@/lib/prisma";

export const getRelatedProducts = async (
  categoriaId: number,
  marcaId: number
): Promise<
  {
    _id: string;
    image: string;
    name: string;
    price: number;
    stock: number;
    slug: {
      current: string;
    };
  }[]
> => {
  const relatedProducts = await prisma.producto.findMany({
    take: 8,
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
    where: {
      ...(marcaId && { marcaId }), // solo si existe marcaId
      ...(categoriaId && { categoriaId }), // solo si existe categoriaId
    },
  });
  return relatedProducts.map((p) => ({
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
