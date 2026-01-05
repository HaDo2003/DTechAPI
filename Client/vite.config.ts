import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
    },
  },
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'bundle-analysis.html',
      gzipSize: true,
    })
  ],
  server: {
    proxy: {
      '/api': {
        // target: 'https://localhost:7094',
        target: 'https://dtechapi.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client'],
          apexcharts: ['apexcharts', 'react-apexcharts']
        },
      },
    },
  },
})
