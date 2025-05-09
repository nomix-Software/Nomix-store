"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";

export async function getMisPedidos({ skip = 0, take = 30 }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const ventas = await prisma.venta.findMany({
    where: { usuarioId: user.id },
    orderBy: { fecha: "desc" },
    skip, // cuánto salteo
    take, // cuántos traigo
    include: {
      estado: true,
      productos: {
        include: {
          producto: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              imagenes: { take: 1, select: { url: true } },
            },
          },
        },
      },
    },
  });


  return ventas.map((venta) => ({
    id: venta.id,
    fecha: venta.fecha,
    total: venta.total,
    estado: venta.estado.nombre,
    productos: venta.productos.map((vp) => ({
      nombre: vp.producto.nombre,
      cantidad: vp.cantidad,
      precioUnitario: vp.precioUnitario,
      imagenUrl: vp.producto.imagenes[0]?.url ?? "",
      id: vp.id,
      descripcion: vp.producto.descripcion,
    })),
  }));
}
