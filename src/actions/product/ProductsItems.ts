"use server";

import { RequestProduct } from "@/interfaces";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils";

export const getProducts = async () => {
  const productos = await prisma.producto.findMany({
    take: 30,
    orderBy: {
      nombre: "asc", // o 'createdAt' si tenés ese campo
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

  // Transformar al formato deseado
  return productos.map((p) => ({
    _id: p.id.toString(),
    image: p.imagenes[0]?.url || "",
    name: p.nombre,
    price: p.precio,
    stock: p.stock,
    slug: {
      current: p.slug,
    },
  }));
};

export const createProduct = async ({
  name,
  description,
  price,
  brand,
  category,
  image,
}: RequestProduct) => {
  await prisma.producto.create({
    data: {
      nombre: name,
      slug: await generateSlug(name),
      descripcion: description,
      precio: Number(price),
      stock: 120,
      categoriaId: Number(category),
      marcaId: Number(brand),
      imagenes: {
        create: [
          {
            url: image,
          },
        ],
      },
    },
  });
};
