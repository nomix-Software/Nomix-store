import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPurchaseEmail } from "@/actions";

// Utilidad para extraer preferenceId y paymentId del body del webhook
function extractIds(body: {
  data?: {
    id?: string;
    preference_id?: string;
    status?: string;
  };
  type?: string;
  status?: string;
  preference_id?: string;
  payment_id?: string;
}) {
  let preferenceId = null;
  let paymentId = null;
  if (body?.data?.id) paymentId = body.data.id;
  if (body?.data?.preference_id) preferenceId = body.data.preference_id;
  if (body?.type === "payment" && body?.data?.id) paymentId = body.data.id;
  if (body?.type === "payment" && body?.data?.preference_id) preferenceId = body.data.preference_id;
  // Fallbacks
  if (!preferenceId && body?.preference_id) preferenceId = body.preference_id;
  if (!paymentId && body?.payment_id) paymentId = body.payment_id;
  return { preferenceId, paymentId };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { preferenceId, paymentId } = extractIds(body);
    if (!preferenceId || !paymentId) {
      return NextResponse.json({ error: "Faltan datos de la transacción." }, { status: 400 });
    }

    // Buscar si ya existe una venta con ese paymentId (preferenceId no existe en Venta)
    const ventaExistente = await prisma.venta.findFirst({
      where: {
        paymentId: paymentId,
      },
    });
    if (ventaExistente) {
      // Ya existe la venta, no duplicar
      return NextResponse.json({ ok: true, message: "Venta ya registrada." });
    }

    // Buscar el carrito asociado a la preferencia
    const carrito = await prisma.carrito.findFirst({
      where: { preferenceId },
      include: {
        usuario: true,
        items: { include: { producto: true } },
        cupon: true,
      },
    });
    if (!carrito || !carrito.usuario) {
      return NextResponse.json({ error: "No se encontró el carrito o usuario asociado." }, { status: 404 });
    }

    const carritoItems = carrito.items;
    const cupon = carrito.cupon;
    let total = carritoItems.reduce(
      (acc, item) => acc + item.producto.precio * item.cantidad,
      0
    );
    let observacion = "";
    let cuponId = undefined;
    if (cupon) {
      cuponId = cupon.id;
      total = Math.round(total * (1 - cupon.porcentaje / 100));
      observacion = `Se aplicó cupón ${cupon.codigo} con ${cupon.porcentaje}% de descuento.`;
    }

    // Determinar estado de venta según status de Mercado Pago
    let estadoVenta = "PENDIENTE";
    const mpStatus = body?.data?.status || body?.status;
    if (mpStatus === "approved") {
      estadoVenta = "APROBADO";
    } else if (mpStatus === "rejected") {
      estadoVenta = "RECHAZADO";
    } else if (mpStatus === "in_process") {
      estadoVenta = "EN PROCESO";
    } else if (mpStatus) {
      estadoVenta = mpStatus.toUpperCase();
    }

    let estadoInicial = await prisma.estadoPedido.findFirst({
      where: { nombre: estadoVenta },
    });
    if (!estadoInicial) {
      estadoInicial = await prisma.estadoPedido.create({
        data: { nombre: estadoVenta },
      });
    }
    let metodoPago = await prisma.metodoPago.findFirst({
      where: { nombre: "Mercado Pago" },
    });
    if (!metodoPago) {
      metodoPago = await prisma.metodoPago.create({
        data: { nombre: "Mercado Pago" },
      });
    }
    const venta = await prisma.venta.create({
      data: {
        usuarioId: carrito.usuario.id,
        total,
        estadoId: estadoInicial?.id || 1,
        metodoPagoId: metodoPago?.id || 1,
        cuponId: cuponId ?? null,
        observacion: observacion,
        paymentId,
        productos: {
          create: carritoItems.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
            total: item.producto.precio * item.cantidad,
          })),
        },
      },
    });

    // Actualizar stock de productos
    for (const item of carritoItems) {
      await prisma.producto.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    // Actualizar entrega si existe
    await prisma.entrega.updateMany({
      where: { carritoId: carrito.id },
      data: { ventaId: venta.id },
    });

    // Solo crea movimiento financiero y envía mail si el pago fue aprobado
    if (mpStatus === "approved") {
      await prisma.movimientoFinanciero.create({
        data: {
          tipo: "INGRESO",
          monto: total,
          descripcion: `Venta ID ${venta.id} - Mercado Pago`,
        },
      });
      await sendPurchaseEmail(carrito.usuario.email, venta.id);
    }

    // Limpiar carrito
    await prisma.carritoItem.deleteMany({
      where: { carritoId: carrito.id },
    });

    return NextResponse.json({ success: true, estado: estadoVenta });
  } catch (err) {
    console.error("Error en webhook de Mercado Pago:", err);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
