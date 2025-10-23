import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/stream': {
        target: 'https://superchivalrous-susana-unfaithfully.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/stream/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
          });
        },
      },
      '/api/proxy': {
        target: 'https://superchivalrous-susana-unfaithfully.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          // Extraer el parámetro 'path' de la query string
          const url = new URL(path, 'http://localhost');
          const targetPath = url.searchParams.get('path') || '';
          return `/${targetPath}`;
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
          });
        },
      },
    },
  },
  preview: {
    proxy: {
      '/api/proxy': {
        target: 'https://superchivalrous-susana-unfaithfully.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          // Extraer el parámetro 'path' de la query string
          const url = new URL(path, 'http://localhost');
          const targetPath = url.searchParams.get('path') || '';
          return `/${targetPath}`;
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('ngrok-skip-browser-warning', 'true');
          });
        },
      },
    },
  },
})
