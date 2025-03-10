import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load environment variables
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  server: {
    proxy: {
      '/api': {
        target: API_BASE_URL,
        changeOrigin: true,
        secure: false,
      }
    }
  },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: []
  },
  assetsInclude: ['**/*.png']
});
