import { defineConfig } from "vite";
import ZaloMiniApp from "zmp-vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    root: "./src",
    base: process.env.VITE_BASE_URL || "",
    plugins: [tsconfigPaths(), react(), ZaloMiniApp()],
    server: {
      allowedHosts: ['all'],
    },
  });
};


