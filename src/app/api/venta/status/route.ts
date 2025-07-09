import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const preferenceId = searchParams.get("preference_id");
  const paymentId = searchParams.get("payment_id");

  if (!preferenceId && !paymentId) {
    return NextResponse.json({ error: "Faltan parámetros de búsqueda." }, { status: 400 });
  }

  // Buscar la venta por paymentId (que es el único campo en Venta)
  const venta = await prisma.venta.findFirst({
    where: {
      OR: [
        ...(paymentId ? [{ paymentId }] : []),
        ...(preferenceId ? [{ paymentId: preferenceId }] : []),
      ],
    },
    include: {
      productos: { include: { producto: true } },
      estado: true,
      cupon: true,
    },
  });

  if (!venta) {
    return NextResponse.json({ status: "PENDIENTE", message: "La venta aún no fue registrada. Si ya pagaste, espera unos segundos y recarga." });
  }

  return NextResponse.json({
    status: venta.estado?.nombre || "PENDIENTE",
    ventaId: venta.id,
    productos: venta.productos,
    total: venta.total,
    cupon: venta.cupon,
    observacion: venta.observacion,
    fecha: venta.fecha,
  });
}
