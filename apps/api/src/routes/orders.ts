import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middlewares/validation";
import { db } from "@repo/database";
import { ordersTable, orderItemsTable } from "@repo/database/schema";

const router = Router();

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

export default router;
