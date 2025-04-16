"use server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";

export async function deleteProductImage(imageId: number) {
  try {
    // Eliminar la imagen de la base de datos
    const image = await prisma.imagenProducto.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return { success: false, message: "Imagen no encontrada" };
    }
    await cloudinary.uploader.destroy(image.publicId);
    const deletedImage = await prisma.imagenProducto.delete({
      where: { id: imageId },
    });

    return { success: true, message: "Imagen eliminada", deletedImage };
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    return { success: false, message: "Error al eliminar la imagen" };
  }
}
