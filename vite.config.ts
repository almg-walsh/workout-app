import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Use require for fs to avoid type issues
const fs = require('fs');

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost-cert.pem'),
    }
  }
});