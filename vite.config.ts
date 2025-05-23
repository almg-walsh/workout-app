import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Use require for fs to avoid type issues
const fs = require('fs');

export default defineConfig({
  base: '/workout-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Workout App',
        short_name: 'WorkoutApp',
        start_url: '/workout-app/',
        display: 'standalone',
        background_color: '#181a1b',
        theme_color: '#181a1b',
        icons: [
          {
            src: '/workout-app/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/workout-app/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/workout-app/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable', // <-- important!
          },
          {
            src: '/workout-app/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    },
  },
});
