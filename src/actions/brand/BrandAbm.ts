"use server";
import prisma from "@/lib/prisma";

export const setBrand = async (categorieName: string) => {
  const categorie = await prisma.marca.create({
    data: { nombre: categorieName },
  });
  return categorie;
};
