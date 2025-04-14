"use server";
import prisma from "@/lib/prisma";

export const getBrands = async () => {
  const brands = await prisma.marca.findMany({
    select: {
      id: true,
      nombre: true,
    },
    orderBy: {
      nombre: "asc",
    },
  });
  return brands;
};
