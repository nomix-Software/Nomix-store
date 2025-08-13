'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckout } from '../mercadopago/Payments';

// Definimos los tipos de datos que recibirá la acción para mayor claridad
interface Item {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
}

interface DeliveryData {
  tipo: 'RETIRO' | 'ENVIO';
}

interface OrderData {
  items: Item[];
  deliveryData: DeliveryData;
  cuponId?: number;
  costoEnvio: number;
}

export const placeOrder = async (orderData: OrderData) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return { ok: false, url: null, error: 'Debe iniciar sesión para realizar un pedido.' };
  }
  try {
    // 1. Recalcular precios y descuentos vigentes desde la base de datos
    const productIds = orderData.items.map((item) => Number(item.id));
    const productos = await prisma.producto.findMany({
      where: { id: { in: productIds } },
      include: { promocion: true },
    });

    // Mapear los productos por id para acceso rápido
    const productosMap = new Map(productos.map(p => [p.id, p]));

    // 2. Armar los items con precios reales
    const itemsValidados = orderData.items.map((item) => {
      const producto = productosMap.get(Number(item.id));
      if (!producto) throw new Error(`Producto no encontrado: ${item.id}`);
      let precioFinal = producto.precio;
      if (producto.promocion && producto.promocion.descuento > 0) {
        precioFinal = Math.round(producto.precio * (1 - producto.promocion.descuento / 100));
      }
      return {
        id: String(producto.id),
        title: producto.nombre,
        unit_price: precioFinal,
        quantity: item.quantity,
      };
    });

    // 3. Crear la preferencia de pago usando los precios validados
    const checkoutData = await createCheckout(
      itemsValidados,
      session.user.email,
      orderData.costoEnvio
    );

    const { preferenceId, url: checkoutUrl } = checkoutData;

    if (!preferenceId || !checkoutUrl) {
      throw new Error('No se pudo crear la preferencia de pago.');
    }

    // 4. Guardar Carrito y Entrega en una única transacción atómica
    await prisma.$transaction(async (tx) => {
      // Eliminar carrito existente del usuario (si existe)
      await tx.carrito.deleteMany({ where: { usuarioId: session.user.id! } });
      // Crear nuevo carrito
      const carrito = await tx.carrito.create({
        data: {
          usuarioId: session.user.id!,
          cuponId: orderData.cuponId,
          preferenceId: preferenceId,
          items: {
            create: itemsValidados.map((item) => ({
              productoId: Number(item.id),
              cantidad: item.quantity,
            })),
          },
        },
      });
      await tx.entrega.create({ data: { ...orderData.deliveryData, carritoId: carrito.id } });
    });

    return { ok: true, url: checkoutUrl, error: null };
  } catch (error) {
    console.error('Error al procesar la orden:', error);
    return { ok: false, url: null, error: 'No se pudo procesar la orden. Intente nuevamente.' };
  }
};