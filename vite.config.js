import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  // Relative base so the build works on GitHub Pages project sites
  // (served from /wonderverse/) as well as custom domains.
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        trading: resolve(__dirname, 'trading.html'),
      },
    },
  },
});
