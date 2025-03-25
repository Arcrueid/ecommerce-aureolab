import { createFileRoute } from "@tanstack/react-router";

import { ListPagination } from "~/components/list-pagination";
import { ProductCard } from "~/components/product-card";
import { useProducts } from "~/hooks/use-products";

export const Route = createFileRoute("/productos")({
  component: ProductsPage,
});

function ProductsPage() {
  const { products, params } = useProducts();

  return (
    <section className="container mx-auto my-12">
      <div className="flex items-center justify-between px-3 sm:px-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Productos</h1>
          <span className="text-sm text-gray-500">
            {products?.meta.records} resultados
          </span>
        </div>
      </div>
      <div className="mb-6 flex w-full">
        <div className="mx-auto flex md:mr-0 md:ml-auto">
          <ListPagination
            total={products?.meta.total_pages || 0}
            pageIndex={params.pageIndex}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:gap-3 sm:px-0 md:grid-cols-2 md:gap-3 lg:grid-cols-4 xl:gap-6">
        {products?.data?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-6 flex w-full">
        <div className="mx-auto flex md:mr-0 md:ml-auto">
          <ListPagination
            total={products?.meta.total_pages || 0}
            pageIndex={params.pageIndex}
          />
        </div>
      </div>
    </section>
  );
}
