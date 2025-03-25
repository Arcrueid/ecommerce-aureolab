import {
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

// Define relations
export const ordersRelations = relations(ordersTable, ({ many }) => ({
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
}));
