import { type Product } from "@repo/database";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ListPagination } from "~/components/list-pagination";
import { ProductCard } from "~/components/product-card";
import { usePaginationSearchParams } from "~/hooks/use-pagination";
import { PAGE_SIZE } from "~/lib/constants";

import { type PaginateResponse } from "~/models/request";

export const Route = createFileRoute("/productos")({
  component: ProductsPage,
});

function ProductsPage() {
  const [params] = usePaginationSearchParams();

  const { data: products, isPlaceholderData } = useQuery({
    queryKey: [
      "products",
      params.pageIndex,
      params.pageSize,
      params.orderBy,
      params.order,
    ],
    queryFn: () =>
      fetchProducts({
        page: params.pageIndex,
        per_page: params.pageSize,
        order_by: params.orderBy ?? undefined,
        order: params.order ?? undefined,
      }),
    placeholderData: keepPreviousData,
  });

  console.log({ products, isPlaceholderData });

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

async function fetchProducts({
  page = 1,
  per_page = PAGE_SIZE,
  order_by = "createdAt",
  order = "desc",
}: {
  page?: number;
  per_page?: number;
  order_by?: string;
  order?: string;
}): Promise<PaginateResponse<Product>> {
  let url = `${__API_URL__}/api/products/?page=${page}&per_page=${per_page}`;

  if (order_by && order) {
    url += `&order_by=${order_by}&order=${order}`;
  }

  return fetch(url).then((res) => res.json());
}
