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
  images,
  stock
}: RequestProduct) => {
  const createdProduct = await prisma.producto.create({
    data: {
      nombre: name,
      slug: await generateSlug(name),
      descripcion: description,
      precio: Number(price),
      stock: Number(stock),
      categoriaId: Number(category),
      marcaId: Number(brand),
    },
  });

  // Paso 2 y 3: Por cada imagen, crearla y luego relacionarla con el producto
  for (const image of images) {
    const imagen = await prisma.imagenProducto.create({
      data: {
        url: image.url,
        publicId: image.publicId, // Add the required publicId field
        producto: {
          connect: {
            id: createdProduct.id, // Connect the image to the created product
          },
        },
      },
    });
    console.log("Imagen creada:", imagen);
    // await prisma.imagenProducto.create({
    //   data: {
    //     productoId: createdProduct.id, // este es el id del producto
    //     imagenId: imagen.id, // este es el id de la imagen
    //   },
    // });
  }
};
