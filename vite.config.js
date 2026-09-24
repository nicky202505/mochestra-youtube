import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/mochestra-youtube/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});
