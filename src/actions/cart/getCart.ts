'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function getCartByUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error('Usuario no autenticado')
  }

  // Obtener el usuario por email (es único)
  const usuario = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      carrito: {
        include: {
          items: {
            include: {
              producto: {
                include: {
                  imagenes: true,
                },
                
              },
            },
          },
        },
      },
    },
  })

  if (!usuario?.carrito) {
    // Si el usuario no tiene carrito creado, podrías retornarlo vacío o crear uno automáticamente
    return {
      carrito: null,
      mensaje: 'Carrito no encontrado',
    }
  }

  return {
    carrito: usuario.carrito,
  }
}
