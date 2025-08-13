'use server'
import { ProductItem } from "@/interfaces";
import prisma from "@/lib/prisma";
// import { getCupon } from "../discount-coupons/getCupon";

interface PayloadCreateSale {
  estadoPedido: string;
  metodoPago: string;
  products: { cantidad: number; producto: ProductItem }[];
  cuponId?: number;
  total: number;
}


export const createSale = async (
  type: "MANUAL" | "ONLINE",
  { estadoPedido, metodoPago, products, cuponId, total }: PayloadCreateSale
) => {
  // let porcentajeDescuento = 0;
  if (products.some((p) => p.producto === undefined))
    return { status: "failed", message: "producto indefinido" };
  try {
    let estadoInicial = await prisma.estadoPedido.findFirst({
      where: {
        nombre: type === "MANUAL" ? "ENTREGADO" : estadoPedido || "PENDIENTE",
      },
    });
    if (!estadoInicial) {
      estadoInicial = await prisma.estadoPedido.create({
        data: {
          nombre: type === "MANUAL" ? "ENTREGADO" : estadoPedido || "PENDIENTE",
        },
      });
    }
    let newMetodoPago = await prisma.metodoPago.findFirst({
      where: { nombre: metodoPago },
    });
    if (!metodoPago) {
      newMetodoPago = await prisma.metodoPago.create({
        data: { nombre: metodoPago },
      });
    }
    // if (cuponId) {
    //   const cupon = await getCupon(cuponId);
    //   porcentajeDescuento = cupon.porcentaje;
    // }
    const venta = await prisma.venta.create({
      data: {
        usuarioId: null,
        total: total,
        estadoId: estadoInicial?.id || 1,
        metodoPagoId: newMetodoPago?.id || 1,
        cuponId: cuponId || null,
        productos: {
          create: products.map((item) => ({
            productoId: Number(item.producto._id),
            cantidad: item.cantidad,
            precioUnitario: item.producto.price,
            total: item.producto.price * item.cantidad,
          })),
        },
      },
    });
    return { status: "success", data: venta };
  } catch (error) {
    return { status: "failed", message: error };
  }
};
