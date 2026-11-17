import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En GitHub Pages el sitio se publica en https://<usuario>.github.io/<repo>/
const REPO = 'Exp2_S4_Cristian_Torres_DESARROLLO-FRONTEND-II_004A'

export default defineConfig(({ command }) => ({
  // En desarrollo la app vive en la raíz (el service worker de MSW también).
  base: command === 'build' ? `/${REPO}/` : '/',
  plugins: [react()],
  server: {
    port: 5173,
  },
}))
