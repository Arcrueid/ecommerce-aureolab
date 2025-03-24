import { type Product } from "@repo/database";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRightIcon } from "lucide-react";

import { type PaginateResponse } from "~/models/request";

import { ProductCard } from "./product-card";

export const LatestProducts = () => {
  const { data: products } = useQuery({
    queryKey: ["latest-products"],
    queryFn: () => fetchProducts(),
  });

  return (
    <section className="container mx-auto my-12">
      <div className="mb-6 flex items-center justify-between px-3 sm:px-0">
        <h2 className="text-2xl font-bold">Últimos Productos</h2>
        <Link
          to="/productos"
          className="flex flex-row items-center gap-1 text-sm font-medium text-gray-400 hover:text-black"
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

function fetchProducts(): Promise<PaginateResponse<Product>> {
  return fetch(
    `${__API_URL__}/api/products/?page=1&per_page=4&order_by=createdAt&order=desc`,
  ).then((res) => res.json());
}
