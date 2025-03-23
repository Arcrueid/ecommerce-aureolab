import "dotenv/config";
import { reset, seed } from "drizzle-seed";
import { db } from "./database";
import { usersTable } from "./schema";

async function main() {
  await reset(db, { usersTable });
  await seed(db, { usersTable });

  process.exit(0);
}

main();
