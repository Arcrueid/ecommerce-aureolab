import { createFileRoute } from "@tanstack/react-router";

function CheckoutPage() {
  return <div className="p-2">Hello from Checkout!</div>;
}

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});
