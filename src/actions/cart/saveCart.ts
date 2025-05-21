'use server'

import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

type CartItemInput = {
  productoId: number
  cantidad: number
}

export async function saveCart(items: CartItemInput[]) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) {
    throw new Error('Usuario no autenticado')
  }

  // Obtener carrito existente o crear uno nuevo si no existe
  const carrito = await prisma.carrito.upsert({
    where: { usuarioId: userId },
    create: {
      usuarioId: userId,
      items: {
        create: items.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad
        }))
      }
    },
    update: {
      items: {
        deleteMany: {}, // eliminamos los items anteriores
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
