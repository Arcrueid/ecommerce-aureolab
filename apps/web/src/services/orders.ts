import { type PaymentIntent } from "@stripe/stripe-js";

import { type CheckoutData } from "~/models/checkout";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  total: number;
  status: string;
  createdAt: string;
  payment: Record<string, unknown>;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  refundedQuantity?: number;
  refundStatus?: "none" | "partial" | "full";
}

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

export async function fetchOrders(
  email: string,
): Promise<{ success: boolean; orders: Order[]; message: string }> {
  return fetch(`${__API_URL__}/api/orders/by-email/${email}`).then((res) =>
    res.json(),
  );
}

export async function requestRefund(
  orderId: string,
  itemIds: string[] | null,
): Promise<void> {
  return fetch(`${__API_URL__}/api/orders/request-refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderId,
      itemIds,
      isPartial: itemIds !== null,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Error al solicitar el reembolso");
    }
    return res.json();
  });
}
