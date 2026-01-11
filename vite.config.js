import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Removed proxy to live data server; all assets are now static.
export default defineConfig({
  plugins: [react()],
});


