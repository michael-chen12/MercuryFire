import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 設定 @ 別名指向 src 目錄，方便引用不需要寫相對路徑
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
