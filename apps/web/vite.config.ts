import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config({ path: "../../.env" });
const IS_DEV = process.env.NODE_ENV !== "production";

const PORT = process.env.WEB_PORT || 3000;
const API_URL = process.env.API_URL || "http://localhost:3001";
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || "";

if (!API_URL || !STRIPE_PUBLISHABLE_KEY) {
  throw new Error("Missing environment variables");
}

export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(API_URL),
    __STRIPE_PUBLISHABLE_KEY__: JSON.stringify(STRIPE_PUBLISHABLE_KEY),
  },
  server: {
    port: Number(PORT),
    strictPort: true,
    host: "localhost",
  },
  plugins: [
    IS_DEV && basicSsl(),
    tailwindcss(),
    tsconfigPaths(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
