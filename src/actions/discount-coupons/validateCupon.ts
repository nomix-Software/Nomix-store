import prisma from '@/lib/prisma';

export async function validateCupon({ codigo, userEmail }: { codigo: string; userEmail: string }) {
  // Buscar cupón por código
  const cupon = await prisma.cuponDescuento.findFirst({ where: { codigo } });
  if (!cupon) {
    return { status: 'failed', message: 'Cupón inexistente' };
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
