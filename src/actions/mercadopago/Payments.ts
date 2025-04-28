// app/actions/mercadopago/createCheckout.ts
"use server";

import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

const preference = new Preference(client);

type Item = {
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
};

export async function createCheckout(items: Item[], email: string) {
  const response = await preference.create({
    body: {
      items,
      back_urls: {
        success: "https://tuapp.com/success",
        failure: "https://tuapp.com/failure",
        pending: "https://tuapp.com/pending",
      },
      auto_return: "approved",
      payer: {
        email,
      },
    },
  });

  return response.sandbox_init_point || response.init_point;
}
