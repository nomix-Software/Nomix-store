"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";


interface FilterParams {
  search?: string;
  marcas?: string[]; // ej: ["Huggies", "Pampers"]
  categorias?: string[]; // ej: ["Pañales", "Toallitas"]
  page?: number; // número de página actual (comienza en 1)
}

export async function getProductsFiltered({
  search,
  marcas,
  categorias,
  page = 1,
}: FilterParams) {
  const take = 30;
  const skip = (page - 1) * take;
console.log('llamando a page nro', page)
  const filters = {
    activo: true,
    nombre: search ? { contains: search, mode: Prisma.QueryMode.insensitive } : undefined,
    marca:
      marcas && marcas.length > 0
        ? {
            nombre: { in: Array.isArray(marcas) ? marcas : [marcas] },
          }
        : undefined,
    categoria:
      categorias && categorias.length > 0
        ? {
            nombre: { in: categorias },
          }
        : undefined,
  };

  const [totalCount, products] = await Promise.all([
    prisma.producto.count({ where: filters }),
    prisma.producto.findMany({
      where: filters,
      skip,
      take,
      select: {
        id: true,
        nombre: true,
        precio: true,
        slug: true,
        stock: true,
        imagenes: {
          select: {
            url: true,
          },
          take: 1, // Solo una imagen por producto
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / take);

  return {
    currentPage: page,
    totalPages,
    products: products.map((p) => ({
      _id: p.id.toString(),
      image: p.imagenes[0]?.url || "",
      name: p.nombre,
      price: p.precio,
      stock: p.stock,
      slug: {
        current: p.slug,
      },
    })),
  };
}
