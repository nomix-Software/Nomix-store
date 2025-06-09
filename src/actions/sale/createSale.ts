import { ProductItem } from "@/interfaces";
import prisma from "@/lib/prisma";

interface PayloadCreateSale {
    estadoPedido: string
    metodoPago:string
    products: {cantidad:number, producto:ProductItem | undefined}[]
}

export const calcularTotal = (items: {cantidad:number, producto:ProductItem}[]): number => {
  return items.reduce((total, item) => {
    const subtotal = item.producto.price * item.cantidad;
    return total + subtotal;
  }, 0);
};
export const createSale = async (type : 'MANUAL' | 'ONLINE', { estadoPedido, metodoPago, products}:PayloadCreateSale )=>{
    if(products.some(p => p.producto === undefined)) return {status: 'failed', message: 'producto indefinido'}
try {
        let estadoInicial = await prisma.estadoPedido.findFirst({
      where: { nombre: type === 'MANUAL' ?  'ENTREGADO' : estadoPedido  || "PENDIENTE" },
    });
    if (!estadoInicial) {
      estadoInicial = await prisma.estadoPedido.create({
        data: { nombre: type === 'MANUAL' ?  'ENTREGADO' : estadoPedido  || "PENDIENTE" },
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
    const venta = await prisma.venta.create({
      data: {
        usuarioId: null,
        total: calcularTotal(products),
        estadoId: estadoInicial?.id || 1,
        metodoPagoId: newMetodoPago?.id || 1,
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
    return { status: 'success', data:venta}
} catch (error) {
    return {status: 'failed', message: error}
}
}