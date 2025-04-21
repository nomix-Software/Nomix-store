"use server";
import prisma from "@/lib/prisma";

export const getProductsCart = async () => {
  const productos = await prisma.carritoItem.findMany({
    where: {
      carritoId: 1, // reemplazalo por el ID del carrito que quieras consultar
    },
    include: {
      producto: {
        select: {
          nombre: true,
          slug: true,
          precio: true,
          stock: true,
        },
      },
    },
  });
  return productos;
};
