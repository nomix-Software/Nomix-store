"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface FilterParams {
  search?: string;
  marcas?: string[];
  categorias?: string[];
  page?: number;
}

export async function getProductsFiltered({
  search,
  marcas,
  categorias,
  page = 1,
}: FilterParams) {
  const take = 20;
  const skip = (page - 1) * take;

  const filters = {
    activo: true,
    nombre: search ? { contains: search, mode: Prisma.QueryMode.insensitive } : undefined,
    marca:
      marcas && marcas.length > 0
        ? { nombre: { in: Array.isArray(marcas) ? marcas : [marcas] } }
        : undefined,
    categoria:
      categorias && categorias.length > 0
        ? { nombre: { in: categorias } }
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
          select: { url: true },
          take: 1,
        },
      },
    }),
  ]);

  // Filtros para recalcular marcas y categorías disponibles
  const filtersSinMarcas = {
    activo: true,
    nombre: search ? { contains: search, mode: Prisma.QueryMode.insensitive } : undefined,
    categoria:
      categorias && categorias.length > 0
        ? { nombre: { in: categorias } }
        : undefined,
  };
  const filtersSinCategorias = {
    activo: true,
    nombre: search ? { contains: search, mode: Prisma.QueryMode.insensitive } : undefined,
    marca:
      marcas && marcas.length > 0
        ? { nombre: { in: Array.isArray(marcas) ? marcas : [marcas] } }
        : undefined,
  };

  // Recalcular marcas y categorías disponibles en base a los productos filtrados actuales
  const [marcasConCantidad, categoriasConCantidad] = await Promise.all([
    prisma.producto.groupBy({
      by: ["marcaId"],
      where: filtersSinMarcas,
      _count: { marcaId: true },
    }),
    prisma.producto.groupBy({
      by: ["categoriaId"],
      where: filtersSinCategorias,
      _count: { categoriaId: true },
    }),
  ]);

  // Obtener nombres asociados a los IDs
  const [marcasData, categoriasData] = await Promise.all([
    prisma.marca.findMany({
      where: { id: { in: marcasConCantidad.map((m) => m.marcaId) } },
      select: { id: true, nombre: true },
    }),
    prisma.categoria.findMany({
      where: { id: { in: categoriasConCantidad.map((c) => c.categoriaId) } },
      select: { id: true, nombre: true },
    }),
  ]);

  // Asociar nombres a cantidades y filtrar los ya aplicados
  const marcasDisponibles = marcasData
    .map((m) => {
      const count = marcasConCantidad.find((mc) => mc.marcaId === m.id)?._count.marcaId || 0;
      return { nombre: m.nombre, cantidad: count };
    })
    .filter((m) => !(marcas && marcas.includes(m.nombre)));

  const categoriasDisponibles = categoriasData
    .map((c) => {
      const count = categoriasConCantidad.find((cc) => cc.categoriaId === c.id)?._count.categoriaId || 0;
      return { nombre: c.nombre, cantidad: count };
    })
    .filter((c) => !(categorias && categorias.includes(c.nombre)));

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
      slug: { current: p.slug },
    })),
    filtrosDisponibles: {
      marcas: marcasDisponibles,        // [{ nombre: "Pampers", cantidad: 3 }]
      categorias: categoriasDisponibles // [{ nombre: "Pañales", cantidad: 7 }]
    },
  };
}
