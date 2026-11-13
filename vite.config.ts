import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `base: './'` keeps the build portable: the whole app can be opened from a
// local folder during the pitch. The singlefile plugin inlines JS, CSS and
// fonts so `dist/index.html` works without a server and without internet.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
  },
})
