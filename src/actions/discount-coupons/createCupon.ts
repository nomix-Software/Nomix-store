'use server'
import prisma from '@/lib/prisma'

export async function createCupon({ codigo, porcentaje, validoHasta, descripcion }: { codigo: string; porcentaje: number; validoHasta: Date; descripcion?: string }) {
  try {
    const cupon = await prisma.cuponDescuento.create({
      data: { codigo, porcentaje, validoHasta, descripcion },
    });
    return { status: 'success', cupon };
  } catch (error: any) {
    return { status: 'failed', message: error?.message || 'Error al crear cupón' };
  }
}
