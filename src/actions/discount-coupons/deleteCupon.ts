'use server'
import prisma from '@/lib/prisma'

export async function deleteCupon(id: number) {
  try {
    await prisma.cuponDescuento.delete({ where: { id } });
    return { status: 'success' };
  } catch (error: any) {
    return { status: 'failed', message: error?.message || 'Error al eliminar cupón' };
  }
}
