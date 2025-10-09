import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy API calls to the external API
      "^/api": {
        target: process.env.API_BASE_URL || process.env.VITE_PROXY_TARGET || "https://phpstack-1520234-5847937.cloudwaysapps.com/api/v1",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          // Handle different API patterns
          if (path.includes('?type=')) {
            // For type-based calls like /api?type=categories, rewrite to /news/categories
            const url = new URL(path, 'http://localhost');
          const type = url.searchParams.get('type');
          if (type === 'categories') {
            return `/news/categories${url.search}`;
          } else if (type === 'languages') {
            return `/news/languages`;
          } else if (type === 'states') {
            return `/news/states${url.search}`;
          } else if (type === 'districts') {
            return `/news/districts${url.search}`;
          } else if (type === 'roles') {
            return `/roles`;
          } else if (type === 'urgency-patterns') {
            return `/news/urgency-patterns`;
          } else if (type === 'category-keywords') {
            return `/news/category-keywords`;
          }
          }
          // For other API calls, remove /api prefix
          return path.replace(/^\/api/, "");
        },
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  define: {
    'process.env': process.env,
  },
}));
