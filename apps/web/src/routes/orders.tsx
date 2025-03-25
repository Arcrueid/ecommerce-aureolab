import { createFileRoute } from "@tanstack/react-router";

import { OrderListItem } from "~/components/orders/order-list-item";
import { useOrders } from "~/hooks/use-orders";
import { type Order } from "~/services/orders";

function OrdersPage() {
  const { orders, isFetching } = useOrders();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Mis Pedidos</h1>

      {isFetching && !orders?.length && (
        <div className="flex items-center justify-center py-12">
          <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-2 border-gray-300"></div>
        </div>
      )}

      {!isFetching && !orders?.length && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow">
          <h2 className="text-xl font-medium">No tienes pedidos aún</h2>
          <p className="mt-2 text-gray-600">
            Empieza a comprar para ver tus pedidos aquí
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {orders?.map((order: Order) => (
          <OrderListItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});
