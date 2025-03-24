import { type Product } from "@repo/database";
import { ShoppingCartIcon } from "lucide-react";

import { formatCurrency } from "~/lib/utils";

import { Button } from "./ui/button";

export const ProductCard = ({ product }: { product: Product }) => {
  const { category, name, price, image, description } = product;

  return (
    <div className="flex flex-col items-center gap-2 rounded-sm border p-3 pb-4 shadow-2xs transition-shadow duration-300 hover:shadow-xl">
      <div className="flex flex-col items-start">
        <div className="mb-4 aspect-square w-full overflow-clip rounded-xs bg-gray-100">
          <img src={image} alt={name} loading="lazy" className="object-cover" />
        </div>
        <span className="text-sm font-light">{category}</span>
        <h3 className="line-clamp-2 text-base font-medium">{name}</h3>
        <span className="mt-2 text-sm font-light text-gray-500">
          {description}
        </span>
        <div className="mt-4 flex w-full items-center justify-between border-t border-gray-100 pt-3.5">
          <span className="text-2xl font-medium text-black">
            {formatCurrency(price)}
          </span>
          <Button size="sm" className="cursor-pointer text-sm font-light">
            <ShoppingCartIcon className="size-4" /> Comprar ahora
          </Button>
        </div>
      </div>
    </div>
  );
};
