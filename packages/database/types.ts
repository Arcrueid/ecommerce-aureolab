import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { type productsTable } from "./schema";

export type Product = InferSelectModel<typeof productsTable>;
export type NewProduct = InferInsertModel<typeof productsTable>;
