// actions/getCupones.ts
'use server';

import prisma from "@/lib/prisma";



export async function getAllCupons() {
  try {
    const cupones = await prisma.cuponDescuento.findMany({
      orderBy: {
        validoHasta: 'asc',
      },
    });

    return cupones;
  } catch (error) {
    console.error('Error al obtener cupones:', error);
    throw new Error('No se pudieron obtener los cupones.');
  }
}
