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

  const {  status, estadoPedido = ''  } = await req.json();

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

  const total = carritoItems.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );

  try {
    let estadoInicial = await prisma.estadoPedido.findFirst({
      where: { nombre: estadoPedido  || "PENDIENTE" },
    });
    if (!estadoInicial) {
      estadoInicial = await prisma.estadoPedido.create({
        data: { nombre: estadoPedido  || "PENDIENTE" },
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
    //TODO: usar server actions
    const venta = await prisma.venta.create({
      data: {
        usuarioId: user.id,
        total,
        estadoId: estadoInicial?.id || 1,
        metodoPagoId: metodoPago?.id || 1,
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
    
  await prisma.entrega.update({
  where: { carritoId: user?.carrito?.id },
  data: { ventaId: venta.id }
});
    if(status === 'approved'){
      await prisma.movimientoFinanciero.create({
        data: {
          tipo: "INGRESO",
          monto: total,
          descripcion: `Venta ID ${venta.id} - Mercado Pago`,
        },
      });
    }

    // Limpiar carrito
    await prisma.carritoItem.deleteMany({
      where: { carritoId: user.carrito.id },
    });
    sendPurchaseEmail(user.email, venta.id)
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
