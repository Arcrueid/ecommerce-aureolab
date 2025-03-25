import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import {
  type ordersTable,
  type orderItemsTable,
  type productsTable,
  type refundsTable,
  type refundItemsTable,
} from "./schema";

export type Product = InferSelectModel<typeof productsTable>;
export type NewProduct = InferInsertModel<typeof productsTable>;
export type Order = InferSelectModel<typeof ordersTable>;
export type NewOrder = InferInsertModel<typeof ordersTable>;
export type OrderItem = InferSelectModel<typeof orderItemsTable>;
export type NewOrderItem = InferInsertModel<typeof orderItemsTable>;
export type Refund = InferSelectModel<typeof refundsTable>;
export type NewRefund = InferInsertModel<typeof refundsTable>;
export type RefundItem = InferSelectModel<typeof refundItemsTable>;
export type NewRefundItem = InferInsertModel<typeof refundItemsTable>;
