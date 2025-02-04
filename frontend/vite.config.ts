import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), mkcert()],
    server: {
        // https: true,
        port: 3001,
        host: true,
        proxy: {
            "/api": {
                target: "http://localhost:3000/api",
                changeOrigin: true,
                secure: false,
                ssl: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
