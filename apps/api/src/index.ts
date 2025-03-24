import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import { db } from "@repo/database";
import { productsTable } from "@repo/database/schema";

dotenv.config({ path: "../.env" });
const PORT = process.env.API_PORT || 3001;
const app = express();

app.use(express.json());

app.get("/api/products", async (_request: Request, response: Response) => {
  const products = await db.select().from(productsTable);
  response.status(200).json(products);
});

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
