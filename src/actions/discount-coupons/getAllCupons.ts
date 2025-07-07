// actions/getCupones.ts
'use server';

import prisma from "@/lib/prisma";



export async function getAllCupons() {
  return prisma.cuponDescuento.findMany({ orderBy: { id: 'desc' } });
}
