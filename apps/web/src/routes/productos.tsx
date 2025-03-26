import { createFileRoute } from "@tanstack/react-router";

import { ListPagination } from "~/components/list-pagination";
import { ProductCard } from "~/components/product-card";
import { useProducts } from "~/hooks/use-products";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/productos")({
  component: ProductsPage,
});

function ProductsPage() {
  const { products, params } = useProducts();

  const hasPages = products?.meta && products?.meta.total_pages > 1;

  return (
    <main className="container mx-auto my-12">
      <header className="flex items-center justify-between px-3 sm:px-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            {params.search ? `Buscando: ${params.search}` : "Productos"}
          </h1>
          <p className="text-sm text-gray-500" aria-live="polite">
            {products?.meta.records} resultados
          </p>
        </div>
      </header>
      <nav
        className="my-3 flex w-full sm:mt-0 sm:mb-6"
        aria-label="Paginación superior"
      >
        <div className="mx-auto flex h-9 md:mr-0 md:ml-auto">
          {hasPages ? (
            <ListPagination
              total={products?.meta.total_pages || 0}
              pageIndex={params.pageIndex}
            />
          ) : null}
        </div>
      </nav>
      {products?.data?.length === 0 ? (
        <div className="flex min-h-[30vh] flex-row items-center justify-center gap-2 text-xl font-bold text-gray-300 sm:min-h-[50vh]">
          Sin resultados
        </div>
      ) : (
        <section
          aria-label="Listado de productos"
          className={cn(
            "grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 sm:gap-3 sm:px-0 md:grid-cols-2 md:gap-3 lg:grid-cols-4 xl:gap-6",
          )}
        >
          {products?.data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
      <nav className="mt-6 flex w-full" aria-label="Paginación inferior">
        <div className="mx-auto flex h-9 md:mr-0 md:ml-auto">
          {hasPages ? (
            <ListPagination
              total={products?.meta.total_pages || 0}
              pageIndex={params.pageIndex}
            />
          ) : null}
        </div>
      </nav>
    </main>
  );
}
