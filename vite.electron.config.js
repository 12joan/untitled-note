import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const root = './client/electron-pages'

export default defineConfig({
  plugins: [
    react(),
  ],
  root,
  base: './',
  build: {
    outDir: resolve(__dirname, './electron/dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        loading: resolve(root, 'loading.html'),
        error: resolve(root, 'error.html'),
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './client'),
    },
  },
})
