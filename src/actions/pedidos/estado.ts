"use server";

import prisma from "@/lib/prisma";

export async function updatePedidoEstado(
  pedidoId: number,
  nuevoEstado: string
) {
  try {
    const ventas = await prisma.venta.findUnique({
      where: { id: pedidoId },
      // include: {
      //   estado: true,
      // },
    });
    if (!ventas)
      return {
        success: false,
        message: "No se pudo obtener la información del pedido.",
      };
    await prisma.estadoPedido.update({
      where: { id: ventas.estadoId },
      data: { nombre: nuevoEstado },
    });

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    return {
      success: false,
      message: "No se pudo actualizar el estado del pedido.",
    };
  }
}
