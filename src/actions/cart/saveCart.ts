'use server'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

type CartItemInput = {
  productoId: number
  cantidad: number
}

export async function saveCart(items: CartItemInput[], cuponId?: number, preferenceId?: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) {
    throw new Error('Usuario no autenticado')
  }

  // Eliminar todos los items del carrito anterior antes de crear los nuevos
  const carritoExistente = await prisma.carrito.findUnique({
    where: { usuarioId: userId },
    include: { items: true }
  });

  if (carritoExistente) {
    await prisma.carritoItem.deleteMany({ where: { carritoId: carritoExistente.id } });
  }

  // Crear o actualizar el carrito con los nuevos items, cuponId y preferenceId
  const carrito = await prisma.carrito.upsert({
    where: { usuarioId: userId },
    create: {
      usuarioId: userId,
      cuponId: cuponId ?? null,
      preferenceId: preferenceId ?? null,
      items: {
        create: items.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad
        }))
      }
    },
    update: {
      cuponId: cuponId ?? null,
      preferenceId: preferenceId ?? undefined,
      // Ya eliminamos los items antes, solo creamos los nuevos
      items: {
        create: items.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad
        }))
      }
    },
    include: { items: true }
  })

  revalidatePath('/carrito') // opcional, para refrescar si estás en esa ruta
  return carrito
}
