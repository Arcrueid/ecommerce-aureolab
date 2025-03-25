import { type ComponentPropsWithoutRef } from "react";

import { type Product } from "@repo/database";
import { Minus, Plus, TrashIcon } from "lucide-react";

import { cn, formatCurrency } from "~/lib/utils";
import { type CartItem } from "~/stores/cart-store";

type CartListItemProps = {
  item: CartItem;
  removeItem: (product: Product) => void;
  updateQuantity: (product: Product, quantity: number) => void;
  readOnly?: boolean;
};

export const CartListItem = ({
  item,
  removeItem,
  updateQuantity,
  readOnly,
  className,
  ...props
}: CartListItemProps & ComponentPropsWithoutRef<"article">) => {
  return (
    <article
      className={cn("flex flex-row items-center gap-3", className)}
      {...props}
    >
      <figure className="size-16 flex-shrink-0 overflow-hidden rounded-md border">
        <img
          src={item.product.image}
          alt={`Imagen de ${item.product.name}`}
          className="h-full w-full object-cover object-center"
        />
      </figure>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{item.product.name}</h4>
          <div>
            {!readOnly ? (
              <button
                type="button"
                onClick={() => removeItem(item.product)}
                className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
                aria-label={`Eliminar ${item.product.name} del carrito`}
              >
                <TrashIcon className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-3">
            <fieldset
              className="flex items-center gap-2"
              aria-label="Controles de cantidad"
            >
              <legend className="sr-only">Cantidad</legend>
              <button
                onClick={() =>
                  updateQuantity(item.product, Math.max(1, item.quantity - 1))
                }
                className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Disminuir cantidad"
                disabled={item.quantity <= 1 || readOnly}
              >
                <Minus className="size-3" />
              </button>
              <output className="w-4 text-center text-sm" aria-live="polite">
                {item.quantity}
              </output>
              <button
                onClick={() => updateQuantity(item.product, item.quantity + 1)}
                className="flex h-6 w-6 items-center justify-center rounded border border-gray-300 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Aumentar cantidad"
                disabled={readOnly}
              >
                <Plus className="size-3" />
              </button>
            </fieldset>
            <span className="text-sm text-gray-500">
              {formatCurrency(item.product.price)}
            </span>
          </div>

          <span
            className="font-medium"
            aria-label={`Precio total: ${formatCurrency(item.product.price * item.quantity)}`}
          >
            {formatCurrency(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </article>
  );
};
