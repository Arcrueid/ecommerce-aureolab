import { useQuery } from "@tanstack/react-query";

import { fetchLatestProducts } from "~/services/products";

export const useLatestProducts = () => {
  const { data: products, isFetching } = useQuery({
    queryKey: ["latest-products"],
    queryFn: () => fetchLatestProducts(),
  });

  return { products, isFetching } as const;
};
