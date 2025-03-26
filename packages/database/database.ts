import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

dotenv.config({ path: "../../.env" });
const DATABASE_URL = process.env.DATABASE_URL || "";

if (!DATABASE_URL) {
  throw new Error("Missing environment variables");
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export const db = drizzle({ client: pool, schema });
