import { useQuery } from "@tanstack/react-query";

import { fetchOrders } from "~/services/orders";
import { useCartStore } from "~/stores/cart-store";

export const useOrders = () => {
  const email = useCartStore((state) => state.email);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["orders", email],
    queryFn: () => fetchOrders(email),
  });

  return { data, isFetching, refetch } as const;
};
