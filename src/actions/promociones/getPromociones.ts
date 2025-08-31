"use server";
import prisma from "@/lib/prisma";

export async function getPromociones({ search = "", page = 1, pageSize = 10 } = {}) {
  const where = search
    ? {
        descripcion: {
          contains: search,
          mode: "insensitive" as const,
        },
      }
    : {};

  const [promociones, total] = await Promise.all([
    prisma.promocion.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.promocion.count({ where }),
  ]);

  return {
    promociones,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
