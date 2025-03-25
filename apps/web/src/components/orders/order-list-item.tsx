import { useCallback, useMemo, useState } from "react";

import { toast } from "sonner";

import { useOrders } from "~/hooks/use-orders";
import { formatCurrency, formatDate } from "~/lib/utils";
import { requestRefund, type Order, type OrderItem } from "~/services/orders";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const OrderListItem = ({ order }: { order: Order }) => {
  const { refetch } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [refundInProgress, setRefundInProgress] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(
    {},
  );

  const selectedItemsCount = useMemo(
    () => Object.values(selectedItems).filter((selected) => selected).length,
    [selectedItems],
  );

  const toggleOrderExpand = useCallback(
    (orderId: string) => {
      setExpandedOrder(expandedOrder === orderId ? null : orderId);
      setSelectedItems({});
    },
    [expandedOrder],
  );

  const toggleItemSelection = useCallback((itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  const handleRefund = useCallback(
    async (orderId: string, isPartial: boolean) => {
      try {
        setRefundInProgress(orderId);

        // If it's a partial refund, get the selected items
        const itemsToRefund = isPartial
          ? Object.entries(selectedItems)
              .filter(([_, selected]) => selected)
              .map(([itemId]) => itemId)
          : [];

        // Only proceed if there are selected items for partial refund
        if (isPartial && itemsToRefund.length === 0) {
          toast.error("Selecciona al menos un producto para reembolso parcial");
          setRefundInProgress(null);
          return;
        }

        await requestRefund(orderId, isPartial ? itemsToRefund : null);

        toast.success(
          `Solicitud de reembolso ${isPartial ? "parcial" : "total"} enviada correctamente`,
        );
        refetch();
        setExpandedOrder(null);
        setSelectedItems({});
      } catch (error) {
        toast.error("Error al solicitar el reembolso");
        console.error(error);
      } finally {
        setRefundInProgress(null);
      }
    },
    [refetch, selectedItems],
  );

  return (
    <Card key={order.id} className="overflow-hidden">
      <div className="border-b p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm text-gray-500">
              Pedido #{order.id.substring(0, 8)}
            </p>
            <p className="font-medium">
              {order.createdAt ? formatDate(order.createdAt.toString()) : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(order.total)}</p>
            <p
              className={`inline-block rounded px-2 py-1 text-xs ${
                order.status === "refunded"
                  ? "bg-red-100 text-red-800"
                  : order.status === "succeeded"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status === "refunded"
                ? "Reembolsado"
                : order.status === "succeeded"
                  ? "Completado"
                  : "En proceso"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => toggleOrderExpand(order.id)}
        >
          {expandedOrder === order.id ? "Ocultar detalles" : "Ver detalles"}
        </Button>
      </div>

      {expandedOrder === order.id && (
        <>
          <div className="divide-y border-b">
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="flex items-center p-4">
                {/* Only allow selection if the order is completed and not refunded */}
                {order.status === "succeeded" && (
                  <input
                    type="checkbox"
                    className="mr-3 h-4 w-4"
                    checked={!!selectedItems[item.id]}
                    onChange={() => toggleItemSelection(item.id)}
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4">
            <div className="mb-4 flex justify-between">
              <p className="font-medium">Total:</p>
              <p className="font-bold">{formatCurrency(order.total)}</p>
            </div>

            {/* Only show refund buttons if the order is completed and not refunded */}
            {order.status === "succeeded" && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  disabled={!!refundInProgress}
                  onClick={() => handleRefund(order.id, false)}
                  className="flex-1"
                >
                  {refundInProgress === order.id
                    ? "Procesando..."
                    : "Solicitar reembolso total"}
                </Button>
                <Button
                  variant="outline"
                  disabled={
                    !!refundInProgress ||
                    selectedItemsCount === order.items.length ||
                    selectedItemsCount === 0
                  }
                  onClick={() => handleRefund(order.id, true)}
                  className="flex-1"
                >
                  {refundInProgress === order.id
                    ? "Procesando..."
                    : "Solicitar reembolso parcial"}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};
