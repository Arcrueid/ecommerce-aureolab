import { useCallback, useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { CartListItem } from "~/components/cart-list-item";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn, formatCurrency, formatNumber } from "~/lib/utils";
import { useCartStore } from "~/stores/cart-store";

function CheckoutPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCartStore();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    direccion: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Datos del formulario:", formData);
      console.log("Productos:", items);
      // Aquí iría la lógica para procesar el pedido
      toast.success("¡Pedido enviado con éxito!");
    },
    [formData, items],
  );

  if (items.length === 0) {
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
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section aria-labelledby="order-info-heading">
          <Card>
            <CardHeader>
              <CardTitle id="order-info-heading">
                Información de entrega
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección de entrega</Label>
                  <Textarea
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Completar compra
                </Button>
              </CardFooter>
            </form>
          </Card>
        </section>

        <section aria-labelledby="order-summary-heading">
          <Card>
            <CardHeader>
              <CardTitle id="order-summary-heading">
                Resumen del pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              {items.length > 0 ? (
                <>
                  <div
                    role="list"
                    className="space-y-4"
                    aria-label="Productos en tu carrito"
                  >
                    {items.map((item, index) => (
                      <CartListItem
                        key={item.product.id}
                        item={item}
                        removeItem={removeItem}
                        updateQuantity={updateQuantity}
                        className={cn(
                          "pb-3",
                          index !== items.length - 1 ? "border-b" : "",
                        )}
                      />
                    ))}
                  </div>

                  <dl className="mt-4 space-y-1 border-t pt-2">
                    <div className="flex justify-between py-1">
                      <dt>Subtotal</dt>
                      <dd>{formatCurrency(totalPrice)}</dd>
                    </div>
                    <div className="flex justify-between py-1 font-bold">
                      <dt>Total ({formatNumber(totalItems)} productos)</dt>
                      <dd aria-live="polite">{formatCurrency(totalPrice)}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p>Tu carrito está vacío</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});
