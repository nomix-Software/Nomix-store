// actions/getCupones.ts
'use server';

import prisma from "@/lib/prisma";



export async function getCupon(cuponId:number) {
  try {
    const cupones = await prisma.cuponDescuento.findMany({
      orderBy: {
        validoHasta: 'asc',
      },
      where:{
        id:cuponId
      }
    });

    return cupones[0];
  } catch (error) {
    console.error('Error al obtener cupones:', error);
    throw new Error('No se pudieron obtener los cupones.');
  }
}
