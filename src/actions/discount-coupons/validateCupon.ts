'use server'
import prisma from '@/lib/prisma';

export async function validateCupon({ codigo, userEmail }: { codigo: string; userEmail: string }) {
  // Buscar cupón por código, incluyendo usuario asignado
  const cupon = await prisma.cuponDescuento.findFirst({
    where: { codigo },
    include: { usuario: true },
  });
  if (!cupon) {
    return { status: 'failed', message: 'Cupón inexistente' };
  }
  // Si el cupón tiene usuario asignado, solo ese usuario puede usarlo
  if (cupon.usuarioId && cupon.usuario?.email && cupon.usuario.email !== userEmail) {
    return { status: 'failed', message: 'Este cupón es exclusivo para otro usuario' };
  }
  // Verificar vigencia
  const ahora = new Date();
  if (cupon.validoHasta && cupon.validoHasta < ahora) {
    return { status: 'failed', message: 'Cupón vencido' };
  }
  // Verificar si el usuario ya usó el cupón
  const ventaConCupon = await prisma.venta.findFirst({
    where: {
      cuponId: cupon.id,
      usuario: { email: userEmail },
    },
  });
  if (ventaConCupon) {
    return { status: 'failed', message: 'Ya usaste este cupón' };
  }
  // Si el cupón tiene un campo de usos máximos globales, validar aquí (opcional)
  if (typeof cupon.maxUsos === 'number') {
    const usos = await prisma.venta.count({ where: { cuponId: cupon.id } });
    if (usos >= cupon.maxUsos) {
      return { status: 'failed', message: 'El cupón ya alcanzó el máximo de usos' };
    }
  }
  return {
    status: 'success',
    cupon: {
      id: cupon.id,
      codigo: cupon.codigo,
      porcentaje: cupon.porcentaje,
      validoHasta: cupon.validoHasta,
      descripcion: cupon.descripcion,
    },
  };
}
