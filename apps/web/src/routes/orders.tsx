import { createFileRoute } from "@tanstack/react-router";

function OrdersPage() {
  return <div className="p-2">Hello from Orders!</div>;
}

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});
