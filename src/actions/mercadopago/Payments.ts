// app/actions/mercadopago/createCheckout.ts
"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken:
    // prod prod "APP_USR-124483288906851-042322-5ef4198ef3800d7e5cc224251aa6531c-2396035246",
    // prod test "APP_USR-8688105396107782-042923-af5ca2f3e2b8cddd375adabe013682a0-2412510533"
    "APP_USR-8688105396107782-042923-af5ca2f3e2b8cddd375adabe013682a0-2412510533",
});

const preference = new Preference(client);

type Item = {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
};

export async function createCheckout(items: Item[], email: string, shippingCost?: number) {
  const itemsWithShipping = shippingCost && shippingCost > 0
    ? [
        ...items,
        {
          id: 'envio',
          title: 'Envío a domicilio',
          unit_price: shippingCost,
          quantity: 1,
        },
      ]
    : items;
  const response = await preference.create({
    body: {
      items: itemsWithShipping,
      back_urls: {
        success: "https://cyetech.com.ar/checkout/success",
        failure: "https://cyetech.com.ar/checkout/failure",
        pending: "https://cyetech.com.ar/checkout/pending",
      },
      auto_return: "approved",
      payer: {
        email,
      },
      payment_methods: {
        excluded_payment_types: [{ id: 'ticket' }], // Deshabilita efectivo (Rapipago/PagoFacil/Boleto)
      },
    },
  });

  return response.sandbox_init_point || response.init_point;
}
