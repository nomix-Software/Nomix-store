"use server";
import prisma from "@/lib/prisma";

export const getProductDetail = async (slug: string) => {
  const productos = await prisma.producto.findUnique({
    where: { slug },
    include: {
      categoria: true,
      marca: true,
      promocion: true,
      imagenes: true,
    },
  });
  return productos;
};
