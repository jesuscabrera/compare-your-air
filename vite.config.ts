import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const apiKey = env.VITE_OPENAQ_API_KEY;

  return {
    plugins: [react()],
    base: "/",
    server: {
      proxy: {
        "/api": {
          target: "https://api.openaq.org",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              if (apiKey) {
                proxyReq.setHeader("X-API-Key", apiKey);
              }
            });
          },
        },
      },
    },
  };
});
