"use server";

import { RequestProduct } from "@/interfaces";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  description: z.string().min(1, "La descripción es obligatoria."),
  price: z.preprocess((v) => Number(v), z.number().positive("El precio debe ser mayor a 0.")),
  stock: z.preprocess((v) => Number(v), z.number().min(0, "El stock debe ser igual o mayor a 0.")),
  category: z.preprocess((v) => Number(v), z.number().int("La categoría debe ser un número válido.")),
  brand: z.preprocess((v) => Number(v), z.number().int("La marca debe ser un número válido.")),
  images: z.array(
    z.object({
      url: z.string().min(1, "Cada imagen debe tener una url válida."),
      publicId: z.string().min(1, "Cada imagen debe tener un publicId válido."),
    })
  ).min(1, "Debes subir al menos una imagen."),
});

export const createProduct = async (product: RequestProduct) => {
  // Validación con zod
  const parseResult = productSchema.safeParse(product);
  if (!parseResult.success) {
    const errorMessages = parseResult.error.errors.map(e => e.message).join(" | ");
    throw new Error(errorMessages);
  }
  const { name, description, price, brand, category, images, stock } = parseResult.data;
  try {
    const createdProduct = await prisma.producto.create({
      data: {
        nombre: name,
        slug: await generateSlug(name),
        descripcion: description,
        precio: price,
        stock: stock,
        categoriaId: category,
        marcaId: brand,
      },
    });

    for (const image of images) {
      const imagen = await prisma.imagenProducto.create({
        data: {
          url: image.url,
          publicId: image.publicId,
          producto: {
            connect: {
              id: createdProduct.id,
            },
          },
        },
      });
      console.log("Imagen creada:", imagen);
    }
    return createdProduct;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error;
  }
};
