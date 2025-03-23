import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { usersTable } from "./schema";

export type User = InferSelectModel<typeof usersTable>;
export type NewUser = InferInsertModel<typeof usersTable>;
