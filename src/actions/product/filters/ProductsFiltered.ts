"use server";

import prisma from "@/lib/prisma";

interface FilterParams {
  search?: string;
  marcas?: string[]; // puede venir de URL como marca=Marca1&marca=Marca2
  categorias?: string[]; // idem
}

export async function getProductsFiltered({
  search,
  marcas,
  categorias,
}: FilterParams) {
  const products = await prisma.producto.findMany({
    where: {
      nombre: search ? { contains: search, mode: "insensitive" } : undefined,
      marca:
        marcas && marcas.length > 0
          ? {
              nombre: { in: marcas },
            }
          : undefined,
      categoria:
        categorias && categorias.length > 0
          ? {
              nombre: { in: categorias },
            }
          : undefined,
    },
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
  });
  return products.map((p) => ({
    _id: p.id.toString(),
    image: p.imagenes[0]?.url || "",
    name: p.nombre,
    price: p.precio,
    stock: p.stock,
    slug: {
      current: p.slug,
    },
  }));
}
