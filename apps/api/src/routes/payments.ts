import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { validateBody } from "../middlewares/validation";
import stripe from "../utils/stripe";

const router = Router();

const paymentIntentSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ),
});

router.post(
  "/create-payment-intent",
  validateBody(paymentIntentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items } = req.body;

      const totalAmount = items.reduce(
        (acc: number, item: { price: number; quantity: number }) => {
          return acc + item.price * item.quantity;
        },
        0
      );

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        automatic_payment_methods: {
          enabled: true,
        },
        currency: "CLP",
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      next(error);
    }
  }
);

export default router;
