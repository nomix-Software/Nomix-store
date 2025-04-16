"use server";
import prisma from "@/lib/prisma";
// import { generateSlug } from "@/utils";

interface NewProductInput {
  nombre: string;
  slug: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  marcaId: number;
  promocionId?: number;
  imagenes?: { url: string }[]; // cada imagen se vincula mediante su URL
}

export async function updateProduct(slug: string, data: NewProductInput) {
  try {
    // 1. Buscar el producto por slug
    const producto = await prisma.producto.findUnique({
      where: { slug },
    });

    if (!producto) throw new Error("Producto no encontrado");
    const marcaExiste = await prisma.marca.findUnique({
      where: { id: Number(data.marcaId) },
    });

    if (!marcaExiste) {
      console.log("Marca no encontrada:", typeof data.marcaId);
      throw new Error("La marca con el ID indicado no existe.:");
    }
    // 2. Actualizar el producto
    await prisma.producto.update({
      where: { slug },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        stock: data.stock,
        categoria: {
          connect: { id: data.categoriaId },
        },
        marca: {
          connect: { id: data.marcaId },
        },
        ...(data.promocionId
          ? {
              promocion: {
                connect: { id: data.promocionId },
              },
            }
          : {
              promocion: {
                disconnect: true,
              },
            }),
      },
    });

    // 3. Eliminar imágenes anteriores (opcional)
    await prisma.imagenProducto.deleteMany({
      where: {
        productoId: producto.id,
      },
    });

    // 4. Crear nuevas imágenes relacionadas
    if (data.imagenes && data.imagenes.length > 0) {
      await prisma.imagenProducto.createMany({
        data: data.imagenes.map((imgUrl) => ({
          url: imgUrl.url,
          productoId: producto.id,
        })),
      });
    }

    // 5. Devolver el producto actualizado con las nuevas imágenes
    const productoConImagenes = await prisma.producto.findUnique({
      where: { id: producto.id },
      include: { imagenes: true },
    });

    return productoConImagenes;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
}
