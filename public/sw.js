const CACHE_NAME = 'paradise-restaurant-v1.3'
const STATIC_CACHE = 'paradise-static-v1.3'
const DYNAMIC_CACHE = 'paradise-dynamic-v1.3'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/main.css',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&display=swap'
]

const DYNAMIC_ASSETS = [
  '/api/',
  'https://api.github.com/'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Service worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve cached content and implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // Cache-first strategy for static assets
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      caches.open(STATIC_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              if (response) {
                return response
              }
              
              return fetch(request)
                .then((fetchResponse) => {
                  cache.put(request, fetchResponse.clone())
                  return fetchResponse
                })
            })
        })
        .catch(() => {
          // Fallback for offline
          if (request.destination === 'document') {
            return caches.match('/')
          }
        })
    )
    return
  }

  // Network-first strategy for dynamic content
  if (DYNAMIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache when network fails
          return caches.match(request)
        })
    )
    return
  }

  // Stale-while-revalidate strategy for other requests
  event.respondWith(
    caches.open(DYNAMIC_CACHE)
      .then((cache) => {
        return cache.match(request)
          .then((cachedResponse) => {
            const fetchPromise = fetch(request)
              .then((networkResponse) => {
                if (networkResponse.status === 200) {
                  cache.put(request, networkResponse.clone())
                }
                return networkResponse
              })
              .catch(() => cachedResponse || new Response('Offline', { status: 503 }))

            return cachedResponse || fetchPromise
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'menu-sync') {
    event.waitUntil(syncMenuData())
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update from Paradise Restaurant!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Menu',
        icon: '/icons/action-menu.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Paradise Restaurant', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CACHE_MENU_DATA') {
    cacheMenuData(event.data.menuData)
  }
})

// Utility functions
async function syncMenuData() {
  try {
    // Sync any pending menu changes when back online
    const pendingChanges = await getFromIndexedDB('pending-changes')
    
    if (pendingChanges && pendingChanges.length > 0) {
      for (const change of pendingChanges) {
        await syncChangeToServer(change)
      }
      
      await clearFromIndexedDB('pending-changes')
      
      // Notify clients about successful sync
      const clients = await self.clients.matchAll()
      clients.forEach(client => {
        client.postMessage({ type: 'SYNC_COMPLETE' })
      })
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error)
  }
}

async function cacheMenuData(menuData) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const response = new Response(JSON.stringify(menuData), {
      headers: { 'Content-Type': 'application/json' }
    })
    
    await cache.put('/api/menu-data', response)
    
    // Notify clients about cache update
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({ type: 'CACHE_UPDATED' })
    })
  } catch (error) {
    console.error('[SW] Failed to cache menu data:', error)
  }
}

// IndexedDB helpers for offline data storage
function getFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ParadiseRestaurant', 1)
    
    request.onerror = () => reject(request.error)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['offline-data'], 'readonly')
      const store = transaction.objectStore('offline-data')
      const getRequest = store.get(key)
      
      getRequest.onsuccess = () => resolve(getRequest.result?.data)
      getRequest.onerror = () => reject(getRequest.error)
    }
    
    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore('offline-data', { keyPath: 'key' })
    }
  })
}

function clearFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ParadiseRestaurant', 1)
    
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction(['offline-data'], 'readwrite')
      const store = transaction.objectStore('offline-data')
      const deleteRequest = store.delete(key)
      
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}

async function syncChangeToServer(change) {
  // Implementation would sync changes to actual backend
  // For now, just log the change
  console.log('[SW] Syncing change to server:', change)
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
}