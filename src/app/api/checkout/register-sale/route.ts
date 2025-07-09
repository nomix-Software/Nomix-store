import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendPurchaseEmail } from "@/actions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { paymentId } = await req.json();

  // Validación con Mercado Pago
  if (!paymentId) {
    return NextResponse.json({ error: "Falta paymentId" }, { status: 400 });
  }
  let mpData;
  try {
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    });
    if (!mpRes.ok) {
      return NextResponse.json({ error: "No se pudo validar el pago con Mercado Pago" }, { status: 400 });
    }
    mpData = await mpRes.json();
  } catch (error) {
    console.error("Error al validar con Mercado Pago:", error);
    return NextResponse.json({ error: "Error validando con Mercado Pago" }, { status: 500 });
  }

  // Determinar estado de venta según status de Mercado Pago
  let estadoVenta = "PENDIENTE";
  if (mpData.status === "approved") {
    estadoVenta = "APROBADO";
  } else if (mpData.status === "rejected") {
    estadoVenta = "RECHAZADO";
  } else if (mpData.status === "in_process") {
    estadoVenta = "EN PROCESO";
  } else {
    estadoVenta = mpData.status?.toUpperCase() || "PENDIENTE";
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      carrito: {
        include: {
          items: {
            include: {
              producto: true,
            },
          },
          cupon: true, // Incluir el cupón aplicado
        },
      },
    },
  });

  if (!user || !user.carrito) {
    return NextResponse.json(
      { error: "No se encontró el carrito" },
      { status: 404 }
    );
  }

  const carritoItems = user.carrito.items;
  const cupon = user.carrito.cupon;

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

  try {
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
        usuarioId: user.id,
        total,
        estadoId: estadoInicial?.id || 1,
        metodoPagoId: metodoPago?.id || 1,
        cuponId: cuponId ?? null,
        observacion: observacion,
        productos: {
          create: carritoItems.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
            total: item.producto.precio * item.cantidad,
          })),
        },
        // Puedes guardar el paymentId y status de MP si lo deseas
      },
    });

    // Actualizar stock de productos
    for (const item of carritoItems) {
      await prisma.producto.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    await prisma.entrega.update({
      where: { carritoId: user?.carrito?.id },
      data: { ventaId: venta.id },
    });

    // Solo crea movimiento financiero y envía mail si el pago fue aprobado
    if (mpData.status === "approved") {
      await prisma.movimientoFinanciero.create({
        data: {
          tipo: "INGRESO",
          monto: total,
          descripcion: `Venta ID ${venta.id} - Mercado Pago`,
        },
      });
      sendPurchaseEmail(user.email, venta.id);
    }

    // Limpiar carrito
    await prisma.carritoItem.deleteMany({
      where: { carritoId: user.carrito.id },
    });
    return NextResponse.json({ success: true, estado: estadoVenta });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
