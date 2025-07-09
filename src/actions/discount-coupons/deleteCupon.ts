'use server'
import prisma from '@/lib/prisma'

export async function deleteCupon(id: number) {
  try {
    await prisma.cuponDescuento.delete({ where: { id } });
    return { status: 'success' };
  } catch (error) {
    const err = error as Error;
    return { status: 'failed', message: err.message || 'Error al eliminar cupón' };
  }
}
