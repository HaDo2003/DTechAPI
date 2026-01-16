import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';
// import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tsconfigPaths(),
    visualizer({
      open: false,
      filename: 'bundle-analysis.html',
      gzipSize: true,
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7094',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
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
