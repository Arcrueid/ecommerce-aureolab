import { type PaymentIntent } from "@stripe/stripe-js";

import { type CheckoutData } from "~/models/checkout";

export async function createOrder(
  checkoutData: CheckoutData,
  paymentIntent: PaymentIntent,
): Promise<{ clientSecret: string }> {
  console.log({ checkoutData, paymentIntent });

  return fetch(`${__API_URL__}/api/orders/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...checkoutData, payment: paymentIntent }),
  }).then((res) => res.json());
}

export async function fetchOrders(email: string) {
  return fetch(`${__API_URL__}/api/orders/by-email/${email}`).then((res) =>
    res.json(),
  );
}
