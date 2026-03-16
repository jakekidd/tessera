import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname),
  base: '/tessera/demo/',
  build: {
    outDir: resolve(__dirname, '../docs/public/demo'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sandbox: resolve(__dirname, 'sandbox.html'),
      },
    },
  },
});
