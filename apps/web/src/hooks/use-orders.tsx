import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchOrders } from "~/services/orders";
import { useCartStore } from "~/stores/cart-store";

export const useOrders = () => {
  const email = useCartStore((state) => state.email);

  const {
    data: orders,
    isFetching,
    isPlaceholderData,
    refetch
  } = useQuery({
    queryKey: ["orders", email],
    queryFn: () => fetchOrders(email),
    placeholderData: keepPreviousData,
  });

  return { orders, isFetching, isPlaceholderData, refetch } as const;
};
