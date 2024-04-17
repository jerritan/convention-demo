import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    assetsDir: ''
  },
  plugins: [react()],
  server: {
    proxy: {
      '^/file/.*': {
        target: 'https://us-mcd-wwc.switchboardcms.com',
        changeOrigin: true,
      },
    },
  },
})
