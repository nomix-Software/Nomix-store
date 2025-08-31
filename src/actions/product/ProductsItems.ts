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
      nombre: "asc",
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
        take: 1,
      },
      promocion: {
        select: {
          id: true,
          descripcion: true,
          descuento: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });

  // Transformar al formato deseado
  return productos.map((p) => {
    const ratings = p.reviews?.map((r) => r.rating) || [];
    const reviewsCount = ratings.length;
    const averageRating = reviewsCount > 0 ? ratings.reduce((a, b) => a + b, 0) / reviewsCount : null;
    return {
      _id: p.id.toString(),
      image: p.imagenes[0]?.url || "",
      name: p.nombre,
      price: p.precio,
      stock: p.stock,
      slug: {
        current: p.slug,
      },
      promocion: p.promocion
        ? {
            id: p.promocion.id,
            descripcion: p.promocion.descripcion,
            descuento: p.promocion.descuento,
          }
        : null,
      reviewsCount,
      averageRating,
    };
  });
};
