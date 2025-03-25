import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import { errorHandler } from "./utils/errorHandler";
import productRoutes from "./routes/products";
import paymentRoutes from "./routes/payments";
import ordersRoutes from "./routes/orders";
import cors from "cors";

dotenv.config({ path: "../.env" });
const PORT = process.env.API_PORT || 3001;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// API routes
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", ordersRoutes);

// Base health check route
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
