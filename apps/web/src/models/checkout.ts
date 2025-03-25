import { z } from "zod";

export const CheckoutItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export const CheckoutDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  items: z.array(CheckoutItemSchema),
});

export const CheckoutStepTypeSchema = z.enum(["customer-info", "payment"]);

export const CustomerFormDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
});

export type CheckoutItem = z.infer<typeof CheckoutItemSchema>;
export type CheckoutData = z.infer<typeof CheckoutDataSchema>;
export type CheckoutStepType = z.infer<typeof CheckoutStepTypeSchema>;
export type CustomerFormData = z.infer<typeof CustomerFormDataSchema>;
