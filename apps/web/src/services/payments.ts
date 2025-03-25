import { type CheckoutData } from "~/models/checkout";

export async function createPaymentIntent(
  checkoutData: CheckoutData,
): Promise<{ clientSecret: string }> {
  return fetch(`${__API_URL__}/api/payments/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(checkoutData),
  }).then((res) => res.json());
}
