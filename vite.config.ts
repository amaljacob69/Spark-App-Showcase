import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
      manifest: {
        name: 'Paradise Family Restaurant & Bake Shop',
        short_name: 'Paradise Restaurant',
        description: 'Mobile-responsive restaurant menu for Paradise Family Restaurant - Kerala, Arabic & Chinese cuisine',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: './',
        start_url: './',
        icons: [
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        categories: ['food', 'lifestyle', 'business'],
        shortcuts: [
          {
            name: 'Non-AC Menu',
            short_name: 'Non-AC',
            description: 'View Non-AC dining menu',
            url: '/?menu=dinein-non-ac',
            icons: [{ src: '/icons/pwa-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'A/C Menu',
            short_name: 'A/C',
            description: 'View A/C dining menu', 
            url: '/?menu=dinein-ac',
            icons: [{ src: '/icons/pwa-96x96.png', sizes: '96x96' }]
          },
          {
            name: 'Take Away',
            short_name: 'Takeaway',
            description: 'View take away menu',
            url: '/?menu=takeaway',
            icons: [{ src: '/icons/pwa-96x96.png', sizes: '96x96' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif,webp,woff,woff2,ttf,eot}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheKeyWillBeUsed: async ({ request }) => request.url,
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
            },
          },
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast'],
          icons: ['@phosphor-icons/react', 'lucide-react'],
          animation: ['framer-motion']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})