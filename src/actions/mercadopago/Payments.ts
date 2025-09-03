// app/actions/mercadopago/createCheckout.ts
"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN || ' ';
if (!accessToken) {
  throw new Error("MP_ACCESS_TOKEN environment variable is not defined");
}
const client = new MercadoPagoConfig({
  accessToken,
});

const preference = new Preference(client);

type Item = {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
};

export async function createCheckout(items: Item[], email: string, shippingCost?: number) {
  const response = await preference.create({
    body: {
      items: items,
      payer: {
        email,
      },
      shipments: {
        cost: shippingCost && shippingCost > 0 ? shippingCost : 0,
        mode: 'not_specified',
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_URL}/checkout/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/mercadopago/webhook`,
      payment_methods: {
        excluded_payment_types: [{ id: 'ticket' }], // Deshabilita efectivo (Rapipago/PagoFacil/Boleto)
      },
    },
  });

  return {
    url: response.init_point,
    preferenceId: response.id,
  };
}
