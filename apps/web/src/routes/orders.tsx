import { createFileRoute } from "@tanstack/react-router";

import { useOrders } from "~/hooks/use-orders";

function OrdersPage() {
  const { orders, isFetching, isPlaceholderData } = useOrders();

  console.log({ orders, isFetching, isPlaceholderData });

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Mis Pedidos</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2"></div>
    </div>
  );
}

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});
