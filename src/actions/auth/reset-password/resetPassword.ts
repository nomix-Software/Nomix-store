'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function resetPassword(token: string, newPassword: string) {
  try {
    const tokenEntry = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!tokenEntry) {
      return { error: { message: 'Token inválido' } };
    }

    if (new Date() > tokenEntry.expiresAt) {
      return { error: { message: 'El token ha expirado' } };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: tokenEntry.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return { success: true };
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    return { error: { message: 'Ocurrió un error inesperado' } };
  }
}
