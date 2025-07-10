"use server";

import { revalidatePath } from "next/cache";
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
    // Buscar o crear el estadoPedido correspondiente
    let estado = await prisma.estadoPedido.findFirst({ where: { nombre: nuevoEstado } });
    if (!estado) {
      estado = await prisma.estadoPedido.create({ data: { nombre: nuevoEstado } });
    }
    // Actualizar solo el estadoId de la venta
    await prisma.venta.update({
      where: { id: pedidoId },
      data: { estadoId: estado.id },
    });
revalidatePath(`/pedido/${pedidoId}`);
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar el estado del pedido:", error);
    return {
      success: false,
      message: "No se pudo actualizar el estado del pedido.",
    };
  }
}
