import { Link } from "@tanstack/react-router";

import { Button } from "~/components/ui/button";

export const EmptyCart = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <div className="py-12 text-center">
        <p className="mb-4">No hay productos en tu carrito</p>
        <Button asChild>
          <Link to="/">Volver a la tienda</Link>
        </Button>
      </div>
    </div>
  );
};
