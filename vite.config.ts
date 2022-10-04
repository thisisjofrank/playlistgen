import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: "app",
  server: {
    port: 3000,
    strictPort: true,
    host: true
  },
  build: {
    outDir: "../dist",
    sourcemap: true,
    emptyOutDir: true
  },
  plugins: []
})
