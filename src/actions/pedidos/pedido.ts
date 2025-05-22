// app/actions/getPedidoById.ts
'use server';

import prisma from "@/lib/prisma";


export async function getPedidoById(id: number) {
  try {
    const pedido = await prisma.venta.findUnique({
      where: {
        id,
      },
      include: {
        usuario: {
          select: {
            email: true,
          },
        },
        productos: {
          include: {
            producto: {
              select: {
                nombre: true,
                imagenes: true,
              },
            },
          },
          
        },
        estado: true,
        entrega: true,
        cupon: true,
        metodoPago: true,
      },
    });

    return pedido;
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    return null;
  }
}
