import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Force unique timestamp hash on build output to prevent browser HTTP caching on GitHub Pages
const timestamp = Date.now();

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${timestamp}.js`,
        chunkFileNames: `assets/[name]-${timestamp}.js`,
        assetFileNames: `assets/[name]-${timestamp}[extname]`
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
