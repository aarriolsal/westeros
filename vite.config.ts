import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Sitio de proyecto en GitHub Pages: se sirve bajo /westeros/, no en la raíz.
  base: '/westeros/',
  plugins: [tailwindcss(), react()],
})
