import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

const ReactCompilerConfig = {
    target: "18", // '17' | '18' | '19'
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
            },
        }),
        mkcert(),
    ],
    server: {
        // https: true,
        port: 3001,
        host: true,
        proxy: {
            "/api": {
                target: "https://localhost:3000/api",
                changeOrigin: true,
                secure: false,
                // ssl: false,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
