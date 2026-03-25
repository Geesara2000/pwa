import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

let strategy = 'network-first'; // Global state for current strategy

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_STRATEGY') {
    strategy = event.data.strategy;
    console.log('[SW-Research] Strategy updated to:', strategy);
  }
});

// Cache API calls based on the current adaptive strategy
registerRoute(
  ({ url }) => url.origin === 'http://localhost:8000',
  async ({ request, url, event }) => {
    // RESEARCH: This is the decision point
    if (strategy === 'cache-first') {
      return new CacheFirst({ cacheName: 'api-adaptive-cache' }).handle({ event, request });
    } else {
      return new NetworkFirst({ cacheName: 'api-adaptive-cache' }).handle({ event, request });
    }
  }
);
