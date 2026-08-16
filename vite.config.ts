import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  // Репозиторий публикуется GitHub Pages в подпапке /my-site/.
  base: '/my-site/',
});
