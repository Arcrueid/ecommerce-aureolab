import { type Product } from "@repo/database";
import { Minus, Plus, TrashIcon } from "lucide-react";

import { formatCurrency } from "~/lib/utils";
import { type CartItem } from "~/stores/cart-store";

export const CartListItem = ({
  item,
  removeItem,
  updateQuantity,
}: {
  item: CartItem;
  removeItem: (product: Product) => void;
  updateQuantity: (product: Product, quantity: number) => void;
}) => {
  return (
    <article
      className="flex flex-col rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm"
      role="listitem"
    >
      <div className="flex gap-3">
        <figure className="size-16 flex-shrink-0 overflow-hidden rounded-sm border border-gray-200">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </figure>
        <div className="flex flex-1 flex-col">
          <header className="flex justify-between text-base font-medium text-gray-900">
            <h3 className="line-clamp-2 text-sm">{item.product.name}</h3>
          </header>
          <div className="mt-auto flex items-end justify-between">
            <dl>
              <dt className="sr-only">Precio</dt>
              <dd className="text-sm font-medium">
                {formatCurrency(item.product.price)}
              </dd>
            </dl>
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
                disabled={item.quantity <= 1}
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
              >
                <Plus className="size-3" />
              </button>
            </fieldset>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={() => removeItem(item.product)}
            className="text-gray-400 transition-colors hover:text-red-500"
            aria-label={`Eliminar ${item.product.name} del carrito`}
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
