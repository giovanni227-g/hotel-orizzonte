import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Percorsi relativi: la cartella dist/ funziona su qualsiasi hosting o sottocartella.
  base: './',
  plugins: [tailwindcss()],
  // Niente sourcemap in produzione: non pubblicare il sorgente originale.
  build: { sourcemap: false },
});
