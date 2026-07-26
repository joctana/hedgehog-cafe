import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Actions Pages deploys, serve under /<repo>/ (project site URL).
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repo ? `/${repo}/` : './'

export default defineConfig({
  plugins: [react()],
  base,
})
