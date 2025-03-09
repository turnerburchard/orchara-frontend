import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
      server: {
        proxy: {
          '/api': {
            target: 'https://api.orchara.com',
            changeOrigin: true,
            secure: true,
          }
        }
      },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: []
  },
  assetsInclude: ['**/*.png']
}) 