import { type Product } from "@repo/database";
import { ShoppingCartIcon } from "lucide-react";

import { formatCurrency } from "~/lib/utils";

import { Button } from "./ui/button";

export const ProductCard = ({ product }: { product: Product }) => {
  const { category, name, price, image, description } = product;

  return (
    <article className="flex flex-col items-center gap-2 rounded-sm border p-3 pb-4 shadow-2xs transition-shadow duration-300 hover:shadow-xl">
      <div className="flex flex-1 flex-col items-start">
        <figure className="mb-4 aspect-square w-full overflow-clip rounded-xs bg-gray-100">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </figure>
        <header className="flex w-full flex-row justify-between gap-2">
          <div>
            <span className="text-sm font-light">{category}</span>
            <h2 className="line-clamp-2 text-base font-medium">{name}</h2>
          </div>
          <div className="flex items-end justify-end">
            <span
              className="text-2xl font-medium text-black"
              aria-label={`Precio: ${formatCurrency(price)}`}
            >
              {formatCurrency(price)}
            </span>
          </div>
        </header>
        <p className="mt-2 mb-3.5 text-sm font-light text-gray-500">
          {description}
        </p>
        <footer className="mt-auto flex w-full flex-wrap items-center justify-between border-t border-gray-100 pt-3.5 sm:flex-row">
          <Button
            size="default"
            className="w-full cursor-pointer rounded-sm text-sm transition-all duration-200 hover:bg-[#fed137] hover:text-black"
            aria-label={`Agregar ${name} al carrito`}
          >
            <ShoppingCartIcon className="size-4" /> Agregar al carrito
          </Button>
        </footer>
      </div>
    </article>
  );
};
