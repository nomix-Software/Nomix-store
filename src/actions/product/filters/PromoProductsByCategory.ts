"use server";

import prisma from "@/lib/prisma";
import { ProductItem } from "@/interfaces/Product.interface";

export interface PromoProductsByCategory {
  categoria: string;
  products: (ProductItem & { promocion?: { id: number; descripcion: string; descuento: number } | null })[];
}

export type PromoProductsByCategoryResponse = PromoProductsByCategory[];
export async function getPromoProductsByCategory(): Promise<PromoProductsByCategory[]> {
  // Traer todos los productos con promoción activa y sus categorías
  const productos = await prisma.producto.findMany({
    where: {
      activo: true,
      promocionId: { not: null },
    },
    select: {
      id: true,
      nombre: true,
      precio: true,
      slug: true,
      stock: true,
      imagenes: {
        select: { url: true },
        take: 1,
      },
      promocion: {
        select: {
          id: true,
          descripcion: true,
          descuento: true,
        },
      },
      categoria: {
        select: {
          nombre: true,
        },
      },
    },
  });

  // Agrupar por categoría
  const grouped: Record<string, PromoProductsByCategory["products"]> = {};
  for (const p of productos) {
    const cat = p.categoria?.nombre || "Sin categoría";
    const prod: ProductItem & { promocion?: { id: number; descripcion: string; descuento: number } | null } = {
      _id: p.id.toString(),
      image: p.imagenes[0]?.url || "",
      name: p.nombre,
      price: p.precio,
      stock: p.stock,
      slug: { current: p.slug },
      promocion: p.promocion
        ? {
            id: p.promocion.id,
            descripcion: p.promocion.descripcion,
            descuento: p.promocion.descuento,
          }
        : null,
    };
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(prod);
  }

  return Object.entries(grouped).map(([categoria, products]) => ({ categoria, products }));
}
