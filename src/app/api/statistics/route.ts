// app/api/mercado-pago/route.ts
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const MERCADOPAGO_BASE = "https://api.mercadopago.com";
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  throw new Error("Missing Mercado Pago access token in environment variables");
}

// --- Interfaces ---
// interface MercadoPagoPayment {
//   id: number;
//   status: string;
//   payment_type_id: string;
//   transaction_amount: number;
//   date_created: string;
//   pos_id?: string;
//   description?: string;
// }

// interface MercadoPagoOrder {
//   id: number;
//   status: string;
//   preference_id: string;
//   total_amount: number;
//   date_created: string;
// }

// interface ApiResponse {
//   payments: MercadoPagoPayment[];
//   pointOrQrPayments: MercadoPagoPayment[];
//   orders: MercadoPagoOrder[];
// }

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --- Handler ---
export async function GET(
): Promise<NextResponse<MercadoPagoSummaryResponse | { error: string }>> {
  const session = await getServerSession(authOptions);
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Obtener pagos
    const paymentsRes = await fetch(
      `${MERCADOPAGO_BASE}/v1/payments/search?sort=date_created&criteria=desc&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const paymentsData = await paymentsRes.json();
    const payments = paymentsData.results || [];

    // 2. Filtrar cobros por QR o Point
    const pointOrQrPayments = payments.filter(
      (p: { payment_type_id: string; pos_id: string; }) =>
        p.payment_type_id === "account_money" ||
        p.payment_type_id === "ticket" ||
        p.pos_id
    );

    // 3. Obtener órdenes
    const ordersRes = await fetch(
      `${MERCADOPAGO_BASE}/merchant_orders/search?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const ordersData = await ordersRes.json();
    const orders = ordersData.elements || [];

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // enero=1

    // Producto más vendido (suma de cantidades en VentaProducto)
    const bestSelling = await prisma.ventaProducto.groupBy({
      by: ["productoId"],
      _sum: {
        cantidad: true,
      },
      orderBy: {
        _sum: {
          cantidad: "desc",
        },
      },
      take: 1,
    });

    let bestSellingProduct = null;
    if (bestSelling.length > 0) {
      const producto = await prisma.producto.findUnique({
        where: { id: bestSelling[0].productoId },
      });
      bestSellingProduct = {
        productId: producto!.id,
        name: producto!.nombre,
        totalQuantitySold: bestSelling[0]._sum.cantidad ?? 0,
      };
    }

    // Cantidad de ventas realizadas en el mes actual (conteo de ventas con fecha en este mes)
    const startMonth = new Date(year, month - 1, 1);
    const endMonth = new Date(year, month, 1);

    const salesThisMonth = await prisma.venta.count({
      where: {
        fecha: {
          gte: startMonth,
          lt: endMonth,
        },
      },
    });

    // Total de productos activos
    const totalActiveProducts = await prisma.producto.count({
      where: { activo: true },
    });

    // Histórico anual mensual de ventas hasta el mes actual
    const startYear = new Date(year, 0, 1);
    const endYear = new Date(year, month, 1); // hasta el primer día del siguiente mes para incluir el mes actual completo

    const ventasAnuales = await prisma.venta.findMany({
      where: {
        fecha: {
          gte: startYear,
          lt: endYear,
        },
      },
      select: {
        fecha: true,
      },
    });

    // Inicializar mapa con meses hasta el actual
    const monthlySalesMap = new Map<number, number>();
    for (let m = 0; m < month; m++) {
      monthlySalesMap.set(m, 0);
    }

    ventasAnuales.forEach((v) => {
      const m = v.fecha.getMonth(); // 0-based
      if (m < month) {
        monthlySalesMap.set(m, (monthlySalesMap.get(m) ?? 0) + 1);
      }
    });

    const annualSalesHistory = Array.from(monthlySalesMap.entries()).map(
      ([m, qty]) => ({
        month: MONTH_NAMES[m],
        quantity: qty,
      })
    );

    // 4. Armar respuesta resumida
    const summary = [
      { title: "Ordenes", quantity: orders.length },
      { title: "Pagos_recibidos", quantity: payments.length },
      { title: "Cobros_QR_Point", quantity: pointOrQrPayments.length },
      { title: "Ventas_mes", quantity: salesThisMonth },
      { title: "Productos_en_venta", quantity: totalActiveProducts },
      {
        title: "Producto_mas_vendido",
        quantity: bestSellingProduct?.totalQuantitySold ?? 0,
        name: bestSellingProduct?.name ?? null,
      },
      { title: "Historico_anual_ventas", ventas: annualSalesHistory },
    ];
    const response = NextResponse.json(summary);
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=59"
    );
    return response;
  } catch (err) {
    console.error("Error fetching Mercado Pago stats:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
interface SummaryItemBase {
  title: string;
}

interface SummaryItemQuantity extends SummaryItemBase {
  quantity: number;
}

interface SummaryItemBestSelling extends SummaryItemBase {
  quantity: number;
  name: string | null;
}

interface AnnualSale {
  month: string;
  quantity: number;
}

interface SummaryItemAnnualSales extends SummaryItemBase {
  ventas: AnnualSale[];
}

type SummaryItem =
  | SummaryItemQuantity
  | SummaryItemBestSelling
  | SummaryItemAnnualSales;

export type MercadoPagoSummaryResponse = SummaryItem[];
