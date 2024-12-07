import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  root: './src/front', // La carpeta raíz de tu proyecto
  plugins: [react()],
  server: {
    port: 8080, // Puerto que usará Vite en producción
    host: '0.0.0.0', // Escuchar en todas las interfaces de red
  },
});
