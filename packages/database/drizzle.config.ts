import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const DATABASE_URL = process.env.DATABASE_URL || "";

export default {
  schema: "./schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
