import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: "/mind-map/",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 👇 treat <click-spark> as a custom element
          isCustomElement: (tag) => tag === 'click-spark'
        }
      }
    })
  ],
})