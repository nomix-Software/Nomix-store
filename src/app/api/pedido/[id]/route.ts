import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    
    const {id } = await  params
  const ventaId = parseInt(id);

  if (isNaN(ventaId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const venta = await prisma.venta.findUnique({
      where: { id: ventaId },
      include: {
        usuario: {
          select: {
            name: true,
            email: true,
          },
        },
        productos: {
          include: {
            producto: {
              select: {
                nombre: true,
                imagenes: true,
              },
            },
          },
        },
        estado: true,
        entrega: true,
        cupon: true,
        // metodoPago: true, // solo si lo agregás
      },
    });

    if (!venta) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const response = NextResponse.json({
      id: venta.id,
      fecha: venta.fecha,
      total: venta.total,
      estado: venta.estado.nombre,
      metodoPago: "Tarjeta de crédito", // reemplazar si tenés el campo
      usuario: venta.usuario,
      cupon: venta.cupon?.codigo || null,
      entrega: venta.entrega ?? null,
      productos: venta.productos.map((vp) => ({
        nombre: vp.producto.nombre,
        cantidad: vp.cantidad,
        precioUnitario: vp.precioUnitario,
        imagen: vp.producto.imagenes[0]?.url ?? null,
      })),
    });
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=59");
    return response
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener el detalle del pedido" },
      { status: 500 }
    );
  }
}
