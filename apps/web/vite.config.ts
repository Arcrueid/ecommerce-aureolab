import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config({ path: "../../.env" });
const PORT = process.env.WEB_PORT || 3000;
const API_URL = process.env.API_URL || "http://localhost:3001";

export default defineConfig({
  define: {
    __API_URL__: JSON.stringify(API_URL),
  },
  server: {
    port: Number(PORT),
    host: "localhost",
  },
  plugins: [
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
