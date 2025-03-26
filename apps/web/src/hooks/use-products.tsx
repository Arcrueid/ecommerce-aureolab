import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { usePaginationSearchParams } from "~/hooks/use-pagination";
import { fetchProducts } from "~/services/products";

export const useProducts = () => {
  const [params] = usePaginationSearchParams();

  const {
    data: products,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      "products",
      params.pageIndex,
      params.pageSize,
      params.orderBy,
      params.order,
      params.search,
    ],
    queryFn: () =>
      fetchProducts({
        page: params.pageIndex,
        per_page: params.pageSize,
        order_by: params.orderBy ?? undefined,
        order: params.order ?? undefined,
        search: params.search ?? undefined,
      }),
    placeholderData: keepPreviousData,
  });

  return { products, isFetching, isPlaceholderData, params } as const;
};
