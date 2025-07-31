"use server";
import prisma from "@/lib/prisma";

export async function getReviews(productId: number) {
  return await prisma.review.findMany({
    where: { productoId: productId },
    orderBy: { createdAt: "desc" },
    include: {
      usuario: { select: { name: true, id: true } },
    },
  });
}
