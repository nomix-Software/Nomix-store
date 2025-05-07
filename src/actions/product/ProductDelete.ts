// app/actions/producto/eliminarProducto.ts
"use server";

import prisma from "@/lib/prisma";


export async function deleteProduct(id: number) {
  try {
    const producto = await prisma.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      throw new Error("Producto no encontrado.");
    }

    // Desactivación lógica
    await prisma.producto.update({
      where: { id },
      data: {
        activo: false,
        stock: 0, // opcional: para evitar confusiones
      },
    });

    // Podés revalidar alguna ruta o redirigir si hace falta


    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Ocurrió un error al eliminar el producto." };
  }
}
