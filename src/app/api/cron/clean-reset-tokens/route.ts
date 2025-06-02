// src/app/api/cron/cleanup-reset-tokens/route.ts

import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date();

    const deleted = await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: now, // menor a ahora = expirado
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Se eliminaron ${deleted.count} tokens expirados.`,
    });
  } catch (error) {
    console.error('Error eliminando tokens expirados:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
