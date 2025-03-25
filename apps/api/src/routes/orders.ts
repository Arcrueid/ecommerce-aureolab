import { db, eq } from "@repo/database";
import {
  orderItemsTable,
  ordersTable,
  refundItemsTable,
  refundsTable,
} from "@repo/database/schema";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import { validateBody, validateParams } from "../middlewares/validation";
import Stripe from "stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const orderSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  payment: z.record(z.string(), z.any()),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

router.post(
  "/create-order",
  validateBody(orderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items, payment, name, email, address } = req.body;

      const totalAmount = items.reduce(
        (acc: number, item: { price: number; quantity: number }) => {
          return acc + item.price * item.quantity;
        },
        0
      );

      // Use a transaction to ensure the order and its items are created together
      // If an error occurs, it will automatically rollback
      const result = await db.transaction(async (tx) => {
        // 1. Create the order first
        const [newOrder] = await tx
          .insert(ordersTable)
          .values({
            customerName: name,
            customerEmail: email,
            customerAddress: address,
            total: totalAmount,
            status: payment.status,
            payment,
          })
          .returning();

        // 2. Map items for insertion
        const orderItems = items.map(
          (item: {
            id: string;
            name: string;
            price: number;
            quantity: number;
          }) => ({
            orderId: newOrder.id,
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })
        );

        // 3. Insert order items
        await tx.insert(orderItemsTable).values(orderItems);

        return {
          order: newOrder,
          itemsCount: orderItems.length,
        };
      });

      res.status(201).json({
        orderId: result.order.id,
        clientSecret: payment.client_secret,
        status: result.order.status,
        itemsCount: result.itemsCount,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      next(error);
    }
  }
);

// Obtener pedidos por email
router.get(
  "/by-email/:email",
  validateParams(z.object({ email: z.string().email() })),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;

      db.query.ordersTable
        .findMany({
          where: (orders, { eq }) => eq(orders.customerEmail, email),
          with: {
            items: {
              orderBy: (items, { desc }) => [desc(items.createdAt)],
            },
          },
          orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        })
        .then((orders) => {
          if (!orders.length) {
            return res.status(404).json({
              success: false,
              message: "No orders found for this email",
            });
          }

          res.status(200).json({ success: true, orders });
        })
        .catch((error) => {
          console.error("Error getting orders by email:", error);
          next(error);
        });
    } catch (error) {
      console.error("Error in route handler:", error);
      next(error);
    }
  }
);

router.post(
  "/request-refund",
  validateBody(
    z.object({
      orderId: z.string().uuid(),
      itemIds: z.array(z.string().uuid()).nullable(),
      isPartial: z.boolean().default(false),
    })
  ),
  async (req: Request, res: Response) => {
    try {
      const { orderId, itemIds, isPartial } = req.body;

      const order = await db.query.ordersTable.findFirst({
        where: (orders, { eq }) => eq(orders.id, orderId),
        with: {
          items: true,
        },
      });

      if (!order) {
        res.status(404).json({ message: "Order not found" });
        return;
      }

      let refundAmount = 0;

      // If it's a total refund
      if (!isPartial || !itemIds || itemIds.length === 0) {
        // Filter items that haven't been refunded yet or partially refunded
        const nonRefundedOrPartialItems = order.items.filter(
          (item) =>
            item.refundStatus !== "full" &&
            (!item.refundedQuantity || item.refundedQuantity < item.quantity)
        );

        refundAmount = nonRefundedOrPartialItems.reduce((sum, item) => {
          const pendingQuantity = item.quantity - (item.refundedQuantity || 0);
          return sum + item.price * pendingQuantity;
        }, 0);
      } else {
        // If it's a partial refund, calculate the amount of selected items
        const itemsToRefund = order.items.filter((item) =>
          itemIds.includes(item.id)
        );
        refundAmount = itemsToRefund.reduce((sum, item) => {
          const pendingQuantity = item.quantity - (item.refundedQuantity || 0);
          return sum + item.price * pendingQuantity;
        }, 0);
      }

      const paymentInfo = order.payment as Record<string, unknown>;
      const paymentIntentId = paymentInfo.id as string;

      if (!paymentIntentId) {
        res
          .status(400)
          .json({ message: "No se pudo encontrar la información de pago" });
        return;
      }

      // Create the refund in Stripe
      await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: refundAmount,
      });

      // Transaction to create refund and update items
      await db.transaction(async (tx) => {
        // 1. Create refund record with metadata
        const [refund] = await tx
          .insert(refundsTable)
          .values({
            orderId: order.id,
            amount: refundAmount,
            status: "completed",
            isPartial: isPartial && itemIds && itemIds.length > 0,
            reason: "Solicitud de cliente",
          })
          .returning();

        // 2. If it's a total refund, update all items
        if (!isPartial || !itemIds || itemIds.length === 0) {
          // Filter items that haven't been refunded yet
          const nonRefundedItems = order.items.filter(
            (item) =>
              item.refundStatus !== "full" &&
              (!item.refundedQuantity || item.refundedQuantity < item.quantity)
          );

          for (const item of nonRefundedItems) {
            await tx
              .update(orderItemsTable)
              .set({
                refundedQuantity: item.quantity,
                refundStatus: "full",
              })
              .where(eq(orderItemsTable.id, item.id));

            await tx.insert(refundItemsTable).values({
              refundId: refund.id,
              orderItemId: item.id,
              quantity: item.quantity - (item.refundedQuantity || 0),
            });
          }

          // Update order status
          await tx
            .update(ordersTable)
            .set({ status: "refunded" })
            .where(eq(ordersTable.id, order.id));
        } else {
          // 3. If it's a partial refund, only update selected items
          for (const itemId of itemIds) {
            const item = order.items.find((i) => i.id === itemId);

            if (item) {
              await tx
                .update(orderItemsTable)
                .set({
                  refundedQuantity: item.quantity,
                  refundStatus: "full",
                })
                .where(eq(orderItemsTable.id, item.id));

              await tx.insert(refundItemsTable).values({
                refundId: refund.id,
                orderItemId: item.id,
                quantity: item.quantity - (item.refundedQuantity || 0),
              });
            }
          }

          // Check if all items are refunded after this partial refund
          // Get all order items from database with updated refund status
          const updatedItems = await tx.query.orderItemsTable.findMany({
            where: (items, { eq }) => eq(items.orderId, order.id),
          });

          // Check if there are any items that haven't been fully refunded
          const nonRefundedItems = updatedItems.filter(
            (item) => item.refundStatus !== "full"
          );

          if (nonRefundedItems.length === 0) {
            // If all items have been refunded, mark order as fully refunded
            await tx
              .update(ordersTable)
              .set({ status: "refunded" })
              .where(eq(ordersTable.id, order.id));
          } else {
            // If there are still some non-refunded items, mark as partially refunded
            await tx
              .update(ordersTable)
              .set({ status: "partially_refunded" })
              .where(eq(ordersTable.id, order.id));
          }
        }
      });

      res.status(200).json({
        message: `Reembolso ${isPartial ? "parcial" : "total"} procesado correctamente`,
        orderId,
        amount: refundAmount,
      });
    } catch (error) {
      console.error("Error al procesar reembolso:", error);

      // Handle Stripe specific errors with better messages
      const stripeError = error as { type?: string; message?: string };
      if (stripeError.type && stripeError.type.startsWith("Stripe")) {
        res.status(400).json({
          message: `Error de Stripe: ${stripeError.message}`,
          stripeError: stripeError.type,
        });
        return;
      }

      res.status(500).json({ message: "Error al procesar el reembolso" });
    }
  }
);

export default router;
