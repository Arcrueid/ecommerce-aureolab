import { type Product } from "@repo/database";

import { CartListItem } from "~/components/cart-list-item";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn, formatCurrency, formatNumber } from "~/lib/utils";
import type { CartItem } from "~/stores/cart-store";

interface OrderSummaryProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  removeItem: (product: Product) => void;
  updateQuantity: (product: Product, quantity: number) => void;
  readOnly?: boolean;
}

export const OrderSummary = ({
  items,
  totalItems,
  totalPrice,
  removeItem,
  updateQuantity,
  readOnly,
}: OrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle id="order-summary-heading">Resumen del pedido</CardTitle>
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
                  readOnly={readOnly}
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
  );
};
