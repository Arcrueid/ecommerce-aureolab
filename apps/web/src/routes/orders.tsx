import { createFileRoute } from "@tanstack/react-router";

import { ChangeUserButton } from "~/components/change-user-button";
import { OrderListItem } from "~/components/orders/order-list-item";
import { useOrders } from "~/hooks/use-orders";
import { type Order } from "~/services/orders";
import { useCartStore } from "~/stores/cart-store";

function OrdersPage() {
  const { data, isFetching } = useOrders();
  const email = useCartStore((state) => state.email);

  if (!data?.success) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="my-6 rounded-lg border border-gray-200 bg-white p-8 text-center shadow">
          <h2 className="text-xl font-medium">Error al cargar los pedidos</h2>
          <p className="mt-2 mb-6 text-gray-600">{data?.message}</p>
          <ChangeUserButton />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between px-3 sm:px-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Mis Pedidos</h1>
          <p className="text-sm text-gray-500" aria-live="polite">
            {email}
          </p>
        </div>
        <ChangeUserButton />
      </header>

      {isFetching && !data?.orders?.length && (
        <div className="flex items-center justify-center py-12">
          <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-2 border-gray-300"></div>
        </div>
      )}

      {!isFetching && !data?.orders?.length && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow">
          <h2 className="text-xl font-medium">No tienes pedidos aún</h2>
          <p className="mt-2 text-gray-600">
            Empieza a comprar para ver tus pedidos aquí
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {data?.orders?.map((order: Order) => (
          <OrderListItem key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});
