/**
 * Service Worker for offline functionality and caching
 * This file will be placed in the public directory
 */

const CACHE_NAME = 'paradise-restaurant-v2.0.0'
const STATIC_CACHE = `${CACHE_NAME}-static`
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`
const IMAGE_CACHE = `${CACHE_NAME}-images`

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/main.css',
  '/src/index.css',
  '/manifest.json',
  // Add other critical files
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static files')
        return cache.addAll(STATIC_FILES.map(url => new Request(url, { credentials: 'same-origin' })))
      }),
      caches.open(DYNAMIC_CACHE),
      caches.open(IMAGE_CACHE)
    ]).then(() => {
      console.log('Service Worker installation complete')
      self.skipWaiting()
    }).catch((error) => {
      console.error('Service Worker installation failed:', error)
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (!cacheName.includes('v2.0.0')) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log('Service Worker activation complete')
      return self.clients.claim()
    })
  )
})

// Fetch event - serve cached files when offline
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request))
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  } else if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
  } else {
    event.respondWith(handleStaticRequest(request))
  }
})

// Handle image requests with image-specific caching
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE)
    const cached = await cache.match(request)
    
    if (cached) {
      return cached
    }
    
    const response = await fetch(request)
    
    if (response.ok) {
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('Image request failed:', error)
    // Return a default image or placeholder
    return new Response('Image not available', { status: 404 })
  }
}

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const response = await fetch(request)
    
    if (response.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('API request failed, trying cache:', error)
    
    // Fall back to cache
    const cache = await caches.open(DYNAMIC_CACHE)
    const cached = await cache.match(request)
    
    if (cached) {
      return cached
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This request requires an internet connection' 
      }), 
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle navigation requests (page requests)
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const response = await fetch(request)
    return response
  } catch (error) {
    console.log('Navigation request failed, serving offline page')
    
    // Serve cached index.html for SPA routing
    const cache = await caches.open(STATIC_CACHE)
    const cached = await cache.match('/index.html')
    
    return cached || new Response(
      '<!DOCTYPE html><html><head><title>Paradise Restaurant - Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
}

// Handle static file requests
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE)
    const cached = await cache.match(request)
    
    if (cached) {
      return cached
    }
    
    const response = await fetch(request)
    
    if (response.ok) {
      // Cache the response
      const dynamicCache = await caches.open(DYNAMIC_CACHE)
      dynamicCache.put(request, response.clone())
    }
    
    return response
  } catch (error) {
    console.log('Static request failed:', error)
    
    // Try dynamic cache
    const dynamicCache = await caches.open(DYNAMIC_CACHE)
    const cached = await dynamicCache.match(request)
    
    return cached || new Response('Resource not available offline', { status: 404 })
  }
}

// Background sync for queued actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag)
  
  if (event.tag === 'menu-sync') {
    event.waitUntil(syncMenuData())
  }
})

// Sync menu data when back online
async function syncMenuData() {
  try {
    // Get queued data from IndexedDB or localStorage
    console.log('Syncing menu data...')
    
    // Implement actual sync logic here
    // This would typically involve:
    // 1. Reading queued changes from storage
    // 2. Sending them to the server
    // 3. Updating local storage with server response
    
    console.log('Menu data sync completed')
  } catch (error) {
    console.error('Menu data sync failed:', error)
    throw error
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received')
  
  const options = {
    body: 'New updates available for Paradise Restaurant menu!',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Menu',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Paradise Restaurant', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    )
  }
})

// Message handling for communication with the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('Service Worker script loaded')