import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const productsTable = pgTable("products", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  slug: text().notNull(),
  price: integer().notNull(),
  description: text().notNull(),
  category: varchar({ length: 255 }).notNull(),
  image: text().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const ordersTable = pgTable("orders", {
  id: uuid().defaultRandom().primaryKey(),
  customerName: text().notNull(),
  customerEmail: text().notNull(),
  customerAddress: text().notNull(),
  total: integer().notNull(),
  status: varchar({ length: 50 }).notNull().default("pending"),
  payment: jsonb("payment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export const orderItemsTable = pgTable("order_items", {
  id: uuid().defaultRandom().primaryKey(),
  orderId: uuid()
    .notNull()
    .references(() => ordersTable.id, {
      onDelete: "cascade",
    }),
  productId: uuid()
    .notNull()
    .references(() => productsTable.id),
  name: text().notNull(),
  price: integer().notNull(),
  quantity: integer().notNull().default(1),
  refundedQuantity: integer().default(0),
  refundStatus: varchar({ length: 50 }).default("none"), // none, partial, full
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

// Tabla de reembolsos
export const refundsTable = pgTable("refunds", {
  id: uuid().defaultRandom().primaryKey(),
  orderId: uuid()
    .notNull()
    .references(() => ordersTable.id, {
      onDelete: "cascade",
    }),
  amount: integer().notNull(),
  reason: text(),
  status: varchar({ length: 50 }).notNull().default("pending"), // pending, approved, rejected
  isPartial: boolean("is_partial").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

// Tabla para relacionar items con reembolsos
export const refundItemsTable = pgTable("refund_items", {
  id: uuid().defaultRandom().primaryKey(),
  refundId: uuid()
    .notNull()
    .references(() => refundsTable.id, {
      onDelete: "cascade",
    }),
  orderItemId: uuid()
    .notNull()
    .references(() => orderItemsTable.id, {
      onDelete: "cascade",
    }),
  quantity: integer().notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

// Define relations
export const ordersRelations = relations(ordersTable, ({ many }) => ({
  items: many(orderItemsTable),
  refunds: many(refundsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one, many }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
  refundItems: many(refundItemsTable),
}));

export const refundsRelations = relations(refundsTable, ({ one, many }) => ({
  order: one(ordersTable, {
    fields: [refundsTable.orderId],
    references: [ordersTable.id],
  }),
  items: many(refundItemsTable),
}));

export const refundItemsRelations = relations(refundItemsTable, ({ one }) => ({
  refund: one(refundsTable, {
    fields: [refundItemsTable.refundId],
    references: [refundsTable.id],
  }),
  orderItem: one(orderItemsTable, {
    fields: [refundItemsTable.orderItemId],
    references: [orderItemsTable.id],
  }),
}));
