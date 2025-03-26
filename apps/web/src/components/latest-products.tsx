import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { useLatestProducts } from "~/hooks/use-latest-products";

import { ProductCard } from "./product-card";

export const LatestProducts = () => {
  const { products } = useLatestProducts();

  return (
    <section className="container mx-auto my-12">
      <div className="mb-6 flex items-center justify-between px-3 sm:px-0">
        <h2 className="text-2xl font-bold">Últimos Productos</h2>
        <Link
          to="/productos"
          className="mr-3 flex flex-row items-center gap-1 text-sm font-medium"
        >
          Ver Todos <ArrowRightIcon className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:gap-3 sm:px-0 md:grid-cols-2 md:gap-3 lg:grid-cols-4 xl:gap-6">
        {products?.data?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
