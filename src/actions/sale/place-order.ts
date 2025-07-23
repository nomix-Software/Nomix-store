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
    // 1. Crear la preferencia de pago usando la acción centralizada
    const checkoutData = await createCheckout(
      orderData.items,
      session.user.email,
      orderData.costoEnvio
    );

    const { preferenceId, url: checkoutUrl } = checkoutData;

    if (!preferenceId || !checkoutUrl) {
      throw new Error('No se pudo crear la preferencia de pago.');
    }

    // 2. Guardar Carrito y Entrega en una única transacción atómica
    await prisma.$transaction(async (tx) => {
      const carrito = await tx.carrito.create({
        data: {
          usuarioId: session.user.id!,
          cuponId: orderData.cuponId,
          preferenceId: preferenceId, // Usamos el ID de createCheckout
          items: {
            create: orderData.items.map((item) => ({
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