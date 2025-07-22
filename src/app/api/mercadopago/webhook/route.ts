import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPurchaseEmail, sendWebhookErrorEmail } from "@/actions/index";
import { Prisma } from "@prisma/client";
import axios from "axios";
// Utilidad para extraer preferenceId y paymentId del body del webhook
function extractPaymentId(body: {
  data?: { id?: string };
  type?: string;
}) {
  if (body?.type === "payment" && body?.data?.id) {
    return body.data.id.toString();
  }
  return null;
}

const carritoConDetallesQuery = Prisma.validator<Prisma.CarritoDefaultArgs>()({
  include: {
    usuario: true,
    items: { include: { producto: true } },
    cupon: true,
  },
});

type CarritoConDetalles = Prisma.CarritoGetPayload<typeof carritoConDetallesQuery>;

export async function POST(req: Request) {
  // Clonar la request para poder leer el body en el catch si es necesario
  const reqClone = req.clone();

  // Declarar variables fuera del try para que estén disponibles en el catch
  let carrito: CarritoConDetalles | null = null;
  let total: number = 0;

  try {
    console.log("[WEBHOOK] - Inicio POST MercadoPago", );
    // Validar autenticidad del webhook usando la clave secreta de Mercado Pago
    const mpSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    const receivedSecret = req.headers.get("x-signature");
    console.log("[WEBHOOK] - Header x-signature:", receivedSecret);
    const body = await req.json(); // Usar la request original aquí
    console.log("[WEBHOOK] - Body recibido:", JSON.stringify(body));
    if (!mpSecret || receivedSecret !== mpSecret) {
      console.log("[WEBHOOK] - Webhook inválido: clave incorrecta");
      return NextResponse.json({ error: "No autorizado. Webhook inválido." }, { status: 401 });
    }

    const  paymentId  = extractPaymentId(body);
    console.log("[WEBHOOK]"+ "paymentId:", paymentId);

    if (!paymentId) {
      console.log("[WEBHOOK] - Faltan datos de la transacción");
      return NextResponse.json({ error: "Faltan datos de la transacción." }, { status: 400 });
    }
    const mpResponse = await axios.get(
  `https://api.mercadopago.com/v1/payments/${paymentId}`,
  {
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
  }
);
const paymentData = mpResponse.data;
const preferenceId = paymentData.preference_id;

if (!preferenceId) {
  console.error(`[WEBHOOK] - No se encontró preference_id para el paymentId: ${paymentId}`);
  return NextResponse.json({ error: "Datos de pago incompletos desde Mercado Pago." }, { status: 400 });
}

const mpStatus = paymentData.status;

console.log("[WEBHOOK] - preferenceId:", preferenceId, "status:", mpStatus);

    // Buscar si ya existe una venta con ese paymentId (preferenceId no existe en Venta)
    const ventaExistente = await prisma.venta.findFirst({
      where: {
        paymentId: paymentId,
      },
    });
    if (ventaExistente) {
      console.log("[WEBHOOK] - Venta ya registrada");
      // Ya existe la venta, no duplicar
      return NextResponse.json({ ok: true, message: "Venta ya registrada." });
    }

    // Buscar el carrito asociado a la preferencia
    carrito = await prisma.carrito.findFirst({
      where: { preferenceId },
      include: {
        usuario: true,
        items: { include: { producto: true } },
        cupon: true,
      },
    });
    if (!carrito || !carrito.usuarioId) {
      console.log("[WEBHOOK] - No se encontró el carrito o usuario asociado");
      return NextResponse.json({ error: "No se encontró el carrito o usuario asociado." }, { status: 404 });
    }

    const carritoItems = carrito.items;
    const cupon = carrito.cupon;
    total = carritoItems.reduce(
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
    if (mpStatus === "approved") {
      estadoVenta = "APROBADO";
    } else if (mpStatus === "rejected") {
      estadoVenta = "RECHAZADO";
    } else if (mpStatus === "in_process") {
      estadoVenta = "EN PROCESO";
    } else if (mpStatus) {
      estadoVenta = mpStatus.toUpperCase();
    }
    console.log("[WEBHOOK] - Estado venta:", estadoVenta);

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

const ventaCreada = await prisma.$transaction(async (tx) => {
  const venta = await tx.venta.create({
    data: {
      usuarioId: carrito?.usuario.id,
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
      entrega: {connect: {carritoId: carrito?.id}  }
    },
  });
  console.log("[WEBHOOK] - Venta creada con ID:", venta.id);

  // Actualizar stock de productos
  for (const item of carritoItems) {
    await tx.producto.update({
      where: { id: item.productoId },
      data: { stock: { decrement: item.cantidad } },
    });
  }
  console.log("[WEBHOOK] - Stock actualizado");

  // Solo crea movimiento financiero y envía mail si el pago fue aprobado
  if (mpStatus === "approved") {
    await tx.movimientoFinanciero.create({
      data: {
        tipo: "INGRESO",
        monto: total,
        descripcion: `Venta ID ${venta.id} - Mercado Pago`,
      },
    })
    console.log("[WEBHOOK] - Movimiento financiero creado");
  }
  // Limpiar carrito
  await tx.carritoItem.deleteMany({
    where: { carritoId: carrito?.id },
  });
  console.log("[WEBHOOK] - Carrito limpiado");
  return venta
})


  if (mpStatus === "approved") {
    await sendPurchaseEmail(carrito.usuario.email, ventaCreada.id);
    console.log("[WEBHOOK] - Email de compra enviado");
  }

    


    return NextResponse.json({ success: true, estado: estadoVenta });
  } catch (err) {
    const error = err as Error;
    console.error("[WEBHOOK_ERROR] - Error fatal en webhook de Mercado Pago:", error.message, error.stack);

    // Notificar al administrador del error crítico
    const bodyForError = await reqClone.json().catch(() => ({})); // Usar el clon de la request
    const paymentIdForError = extractPaymentId(bodyForError);

    let entrega = null;
    if (carrito?.id) {
      entrega = await prisma.entrega.findUnique({
        where: { carritoId: carrito.id },
      });
    }

    await sendWebhookErrorEmail({
      paymentId: paymentIdForError,
      preferenceId: carrito?.preferenceId,
      errorMessage: error.message,
      errorStack: error.stack,
      usuario: carrito?.usuario ? { nombre: carrito.usuario.name, email: carrito.usuario.email } : null,
      items: carrito?.items?.map(item => ({
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: item.producto.precio,
      })) || null,
      entrega: entrega ? {
        tipo: entrega.tipo,
        direccion: entrega.direccion,
        puntoRetiro: entrega.puntoRetiro,
        contacto: entrega.contacto,
        telefono: entrega.telefono,
        observaciones: entrega.observaciones,
        costoEnvio: entrega.costoEnvio,
      } : null,
      total: total > 0 ? total : null,
    });

    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
