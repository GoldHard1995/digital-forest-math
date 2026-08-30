import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
  resolve: { alias: { '@': projectRoot } },
  build: { outDir: 'dist/client', emptyOutDir: true },
});
