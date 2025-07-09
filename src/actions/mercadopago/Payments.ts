// app/actions/mercadopago/createCheckout.ts
"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";

const accessToken = process.env.MP_ACCESS_TOKEN;
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

  return  response.init_point;
}
