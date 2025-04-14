"use server";
import prisma from "@/lib/prisma";

export const getCategories = async () => {
  const categories = await prisma.categoria.findMany({
    select: {
      id: true,
      nombre: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });
  return categories;
};
