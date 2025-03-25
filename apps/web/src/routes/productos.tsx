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
    <main className="container mx-auto my-12">
      <header className="flex items-center justify-between px-3 sm:px-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-gray-500" aria-live="polite">
            {products?.meta.records} resultados
          </p>
        </div>
      </header>
      <nav className="mb-6 flex w-full" aria-label="Paginación superior">
        <div className="mx-auto flex md:mr-0 md:ml-auto">
          <ListPagination
            total={products?.meta.total_pages || 0}
            pageIndex={params.pageIndex}
          />
        </div>
      </nav>
      <section
        aria-label="Listado de productos"
        className="grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:gap-3 sm:px-0 md:grid-cols-2 md:gap-3 lg:grid-cols-4 xl:gap-6"
      >
        {products?.data?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
      <nav className="mt-6 flex w-full" aria-label="Paginación inferior">
        <div className="mx-auto flex md:mr-0 md:ml-auto">
          <ListPagination
            total={products?.meta.total_pages || 0}
            pageIndex={params.pageIndex}
          />
        </div>
      </nav>
    </main>
  );
}
