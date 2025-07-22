import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendPurchaseEmail, sendWebhookErrorEmail } from "@/actions/index";
import { Prisma } from "@prisma/client";
import axios from "axios";

// Utilidad para extraer preferenceId y paymentId del body del webhook
function extractPaymentId(body: { data?: { id?: string }; type?: string }) {
  if (body?.type === "payment" && body?.data?.id) {
    return body.data.id.toString();
  }
  return null;
}

// Helper para mapear estados de Mercado Pago a los de nuestro sistema
function mapMpStatusToVentaStatus(mpStatus: string): string {
  switch (mpStatus) {
    case "approved":
      return "APROBADO";
    case "in_process":
      return "EN PROCESO";
    case "rejected":
      return "RECHAZADO";
    case "cancelled":
      return "CANCELADO";
    case "refunded":
      return "REEMBOLSADO";
    case "charged_back":
      return "CONTRACARGO";
    default:
      return "PENDIENTE";
  }
}

const carritoConDetallesQuery = Prisma.validator<Prisma.CarritoDefaultArgs>()({
  include: {
    usuario: true,
    items: { include: { producto: true } },
    cupon: true,
  },
});

type CarritoConDetalles = Prisma.CarritoGetPayload<
  typeof carritoConDetallesQuery
>;

export async function POST(req: Request) {
  // Clonar la request para poder leer el body en el catch si es necesario
  const reqClone = req.clone();

  // Declarar variables fuera del try para que estén disponibles en el catch
  let carrito: CarritoConDetalles | null = null;
  let total: number = 0;
  let preferenceId: string | null = null;

  try {
    console.log("[WEBHOOK] - Inicio POST MercadoPago");
    // Validar autenticidad del webhook usando la clave secreta de Mercado Pago
    const mpSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    const receivedSecret = req.headers.get("x-signature");
    console.log("[WEBHOOK] - Header x-signature:", receivedSecret);
    const body = await req.json(); // Usar la request original aquí
    console.log("[WEBHOOK] - Body recibido:", JSON.stringify(body));
    if (!mpSecret || receivedSecret !== mpSecret) {
      console.log("[WEBHOOK] - Webhook inválido: clave incorrecta");
      return NextResponse.json(
        { error: "No autorizado. Webhook inválido." },
        { status: 401 }
      );
    }

    const paymentId = extractPaymentId(body);
    console.log("[WEBHOOK]" + "paymentId:", paymentId);

    if (!paymentId) {
      console.log("[WEBHOOK] - Faltan datos de la transacción");
      return NextResponse.json(
        { error: "Faltan datos de la transacción." },
        { status: 400 }
      );
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
    preferenceId = paymentData.preference_id;

    if (!preferenceId) {
      console.error(
        `[WEBHOOK] - No se encontró preference_id para el paymentId: ${paymentId}`
      );
      return NextResponse.json(
        { error: "Datos de pago incompletos desde Mercado Pago." },
        { status: 400 }
      );
    }

    const mpStatus = paymentData.status;
    const nuevoEstadoVenta = mapMpStatusToVentaStatus(mpStatus);

    console.log(
      `[WEBHOOK] - PaymentID: ${paymentId}, PreferenceID: ${preferenceId}, Nuevo Estado: ${nuevoEstadoVenta}`
    );

    // --- LÓGICA DE IDEMPOTENCIA ---

    // Buscar si ya existe una venta con ese paymentId (preferenceId no existe en Venta)
    const ventaExistente = await prisma.venta.findFirst({
      where: {
        paymentId: paymentId,
      },
      include: {
        estado: true,
        usuario: true,
        productos: { include: { producto: true } },
      },
    });

    if (ventaExistente) {
      // Si el estado no ha cambiado, es una notificación duplicada. No hacemos nada.
      if (ventaExistente.estado.nombre === nuevoEstadoVenta) {
        console.log(
          `[WEBHOOK] - Venta ${ventaExistente.id} ya está en estado ${nuevoEstadoVenta}. Notificación duplicada.`
        );
        return NextResponse.json({
          ok: true,
          message: "Venta ya registrada, sin cambios de estado.",
        });
      }

      // El estado cambió. Actualizar la venta y ejecutar acciones secundarias.
      console.log(
        `[WEBHOOK] - Actualizando venta ${ventaExistente.id} de ${ventaExistente.estado.nombre} a ${nuevoEstadoVenta}`
      );

      await prisma.$transaction(async (tx) => {
        // Actualizar el estado de la venta
        const estadoDb = await tx.estadoPedido.findFirst({
          where: { nombre: nuevoEstadoVenta },
        });
        if (!estadoDb)
          throw new Error(`Estado ${nuevoEstadoVenta} no encontrado`);

        await tx.venta.update({
          where: { id: ventaExistente.id },
          data: { estadoId: estadoDb.id },
        });

        const wasPendingOrProcessing = ["PENDIENTE", "EN PROCESO"].includes(
          ventaExistente.estado.nombre
        );
        const isNowCancelledOrRejected = [
          "CANCELADO",
          "RECHAZADO",
          "REEMBOLSADO",
        ].includes(nuevoEstadoVenta);

        // Lógica para reponer stock si se cancela una venta que estaba pendiente/en proceso
        if (wasPendingOrProcessing && isNowCancelledOrRejected) {
          console.log(
            `[WEBHOOK] - Reponiendo stock para venta ${ventaExistente.id} cancelada/rechazada.`
          );
          for (const item of ventaExistente.productos) {
            await tx.producto.update({
              where: { id: item.productoId },
              data: { stock: { increment: item.cantidad } },
            });
          }
        }

        // Lógica para crear movimiento financiero y enviar email si pasa a APROBADO
        if (
          ventaExistente.estado.nombre !== "APROBADO" &&
          nuevoEstadoVenta === "APROBADO"
        ) {
          await tx.movimientoFinanciero.create({
            data: {
              tipo: "INGRESO",
              monto: ventaExistente.total,
              descripcion: `Venta ID ${ventaExistente.id} - Mercado Pago`,
            },
          });
          console.log(
            `[WEBHOOK] - Movimiento financiero creado para venta actualizada ${ventaExistente.id}`
          );

          if (ventaExistente.usuario?.email) {
            await sendPurchaseEmail(
              ventaExistente.usuario.email,
              ventaExistente.id
            );
            console.log(
              `[WEBHOOK] - Email de compra enviado para venta actualizada ${ventaExistente.id}`
            );
          }
        }
      });

      return NextResponse.json({
        ok: true,
        message: `Venta ${ventaExistente.id} actualizada a ${nuevoEstadoVenta}.`,
      });
    }

    // Buscar el carrito asociado a la preferencia
    carrito = await prisma.carrito.findFirst({
      where: { preferenceId },
      ...carritoConDetallesQuery,
    });
    if (!carrito || !carrito.usuarioId) {
      console.log("[WEBHOOK] - No se encontró el carrito o usuario asociado");
      return NextResponse.json(
        { error: "No se encontró el carrito o usuario asociado." },
        { status: 404 }
      );
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
    let estadoInicial = await prisma.estadoPedido.findFirst({
      where: { nombre: nuevoEstadoVenta },
    });
    if (!estadoInicial) {
      estadoInicial = await prisma.estadoPedido.create({
        data: { nombre: nuevoEstadoVenta },
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
          entrega: { connect: { carritoId: carrito?.id } },
        },
      });
      console.log("[WEBHOOK] - Venta creada con ID:", venta.id);

      // Descontar stock SOLO si el pago está aprobado o pendiente (para reservar).
      if (
        nuevoEstadoVenta === "APROBADO" ||
        nuevoEstadoVenta === "PENDIENTE" ||
        nuevoEstadoVenta === "EN PROCESO"
      ) {
        for (const item of carritoItems) {
          await tx.producto.update({
            where: { id: item.productoId },
            data: { stock: { decrement: item.cantidad } },
          });
        }
        console.log("[WEBHOOK] - Stock descontado para nueva venta.");
      }

      // Crear movimiento financiero y enviar email si el pago fue aprobado desde el inicio
      if (nuevoEstadoVenta === "APROBADO") {
        await tx.movimientoFinanciero.create({
          data: {
            tipo: "INGRESO",
            monto: total,
            descripcion: `Venta ID ${venta.id} - Mercado Pago`,
          },
        });
        console.log("[WEBHOOK] - Movimiento financiero creado");
        if (!carrito?.usuario.email) return;
        await sendPurchaseEmail(carrito?.usuario.email, venta.id);
        console.log("[WEBHOOK] - Email de compra enviado");
      }

      // Limpiar carrito
      await tx.carritoItem.deleteMany({
        where: { carritoId: carrito?.id },
      });
      console.log("[WEBHOOK] - Carrito limpiado");
      return venta;
    });
    if (ventaCreada) {
      await sendPurchaseEmail(carrito.usuario.email, ventaCreada.id);
      console.log(
        `[WEBHOOK] - Email de compra enviado para venta creada ${ventaCreada.id}`
      );
    }
    return NextResponse.json({ success: true, estado: nuevoEstadoVenta });
  } catch (err) {
    const error = err as Error;
    console.error(
      "[WEBHOOK_ERROR] - Error fatal en webhook de Mercado Pago:",
      error.message,
      error.stack
    );

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
      usuario: carrito?.usuario
        ? { nombre: carrito.usuario.name, email: carrito.usuario.email }
        : null,
      items:
        carrito?.items?.map((item) => ({
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio: item.producto.precio,
        })) || null,
      entrega: entrega
        ? {
            tipo: entrega.tipo,
            direccion: entrega.direccion,
            puntoRetiro: entrega.puntoRetiro,
            contacto: entrega.contacto,
            telefono: entrega.telefono,
            observaciones: entrega.observaciones,
            costoEnvio: entrega.costoEnvio,
          }
        : null,
      total: total > 0 ? total : null,
    });

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
