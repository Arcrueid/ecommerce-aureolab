import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config({ path: "../../.env" });
const PORT = process.env.WEB_PORT || 3000;

export default defineConfig({
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
