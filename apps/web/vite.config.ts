import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

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
});
