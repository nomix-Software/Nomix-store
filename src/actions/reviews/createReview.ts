"use server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createReview({ productId, rating, comentario }: { productId: number; rating: number; comentario: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("No autenticado");

  // Validar que el usuario haya comprado el producto
  const hasBought = await prisma.ventaProducto.findFirst({
    where: {
      productoId: productId,
      venta: { usuarioId: session.user.id },
    },
  });
  if (!hasBought) throw new Error("Debes comprar el producto para dejar una reseña");

  // Solo una review por usuario-producto
  const exists = await prisma.review.findUnique({ where: { productoId_usuarioId: { productoId: productId, usuarioId: session.user.id } } });
  if (exists) throw new Error("Ya dejaste una reseña para este producto");

  const review = await prisma.review.create({
    data: {
      productoId: productId,
      usuarioId: session.user.id,
      rating,
      comentario,
    },
    include: {
      usuario: { select: { name: true, id: true } },
    },
  });
  // Obtener el slug del producto para revalidar la ruta correcta
  const producto = await prisma.producto.findUnique({ where: { id: productId }, select: { slug: true } });
  if (producto?.slug) {
    revalidatePath(`/product/${producto.slug}`);
  }
  return review;
}
