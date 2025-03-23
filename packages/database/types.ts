import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { productsTable } from "./schema";

export type Product = InferSelectModel<typeof productsTable>;
export type NewProduct = InferInsertModel<typeof productsTable>;
