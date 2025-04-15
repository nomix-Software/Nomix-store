"use server";
import prisma from "@/lib/prisma";

export const setCategorie = async (categorieName: string) => {
  const categorie = await prisma.categoria.create({
    data: { nombre: categorieName },
  });
  return categorie;
};
