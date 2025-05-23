// app/api/cuotas/route.ts
import { NextRequest, NextResponse } from 'next/server';

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

export async function GET(req: NextRequest) {
  const bin = req.nextUrl.searchParams.get("bin");
  const monto = req.nextUrl.searchParams.get("monto");

  if (!bin || bin.length !== 6) {
    return NextResponse.json({ error: "BIN inválido" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.mercadopago.com/v1/payment_methods/installments?bin=${bin}&amount=${monto}&locale=es-AR`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error al obtener cuotas:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
