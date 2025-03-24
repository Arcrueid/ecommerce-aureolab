import { type Product } from "@repo/database";
import { ShoppingCartIcon } from "lucide-react";

import { formatCurrency } from "~/lib/utils";

import { Button } from "./ui/button";

export const ProductCard = ({ product }: { product: Product }) => {
  const { category, name, price, image, description } = product;

  return (
    <div className="flex flex-col items-center gap-2 rounded-sm border p-3 pb-4 shadow-2xs transition-shadow duration-300 hover:shadow-xl">
      <div className="flex flex-1 flex-col items-start">
        <div className="mb-4 aspect-square w-full overflow-clip rounded-xs bg-gray-100">
          <img src={image} alt={name} loading="lazy" className="object-cover" />
        </div>
        <div className="flex w-full flex-row justify-between gap-2">
          <div>
            <span className="text-sm font-light">{category}</span>
            <h3 className="line-clamp-2 text-base font-medium">{name}</h3>
          </div>
          <div className="flex items-end justify-end">
            <span className="text-2xl font-medium text-black">
              {formatCurrency(price)}
            </span>
          </div>
        </div>
        <span className="mt-2 mb-3.5 text-sm font-light text-gray-500">
          {description}
        </span>
        <div className="mt-auto flex w-full flex-wrap items-center justify-between border-t border-gray-100 pt-3.5 sm:flex-row">
          <Button
            size="default"
            className="w-full cursor-pointer rounded-sm text-sm transition-all duration-200 hover:bg-[#fed137] hover:text-black"
          >
            <ShoppingCartIcon className="size-4" /> Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  );
};
