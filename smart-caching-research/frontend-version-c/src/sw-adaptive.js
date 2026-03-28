import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { clientsClaim } from 'workbox-core';

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

let strategy = 'network-first'; // Global state for current strategy

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'UPDATE_STRATEGY') {
    strategy = event.data.strategy;
    console.log('[SW-Research] Strategy updated to:', strategy);
  }
});

// Research Plugin for Data Age Tracking & Logging
const createResearchPlugin = (apiName) => ({
  cacheWillUpdate: async ({ response }) => {
    console.log(`[SW-Research] [${apiName}] Network response received, saving to cache...`);
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Cache-At', Date.now().toString());
    return new Response(response.clone().body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
  cachedResponseWillBeUsed: async ({ cachedResponse }) => {
    if (cachedResponse) {
      console.log(`[SW-Research] [${apiName}] Serving from cache...`);
      const newHeaders = new Headers(cachedResponse.headers);
      newHeaders.set('X-Cache-Source', 'cache');
      return new Response(cachedResponse.clone().body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: newHeaders,
      });
    }
    return cachedResponse;
  },
  fetchDidFail: async () => {
    console.log(`[SW-Research] [${apiName}] Network failed, falling back to cache if available...`);
  }
});

const handleApiRequest = async ({ request, url, event }, apiName, cacheName) => {
  console.log(`[SW-Research] Intercepted ${apiName} request:`, url.href);
  console.log(`[SW-Research] Selected adaptive strategy: ${strategy}`);
  
  const options = { cacheName, plugins: [createResearchPlugin(apiName)] };
  const strategyHandler = strategy === 'cache-first' 
    ? new CacheFirst(options) 
    : new NetworkFirst(options);

  // use handleAll to track both the response AND the cache write completion
  const [responsePromise, donePromise] = strategyHandler.handleAll({ event, request });
  
  const result = await responsePromise;

  // IMPORTANT: Await the cache put explicitly to ensure DevTools Cache Storage 
  // is fully populated immediately, preventing race conditions before page finishes loading.
  if (donePromise) {
    event.waitUntil(donePromise);
    await donePromise;
  }

  // Add headers to network responses 
  const responseHeaders = new Headers(result.headers);
  if (!responseHeaders.has('X-Cache-Source')) {
    responseHeaders.set('X-Cache-Source', 'network');
    responseHeaders.set('X-Cache-At', Date.now().toString());
    
    // Use an explicitly cloned stream so the network result body isn't locked
    return new Response(result.clone().body, {
      status: result.status,
      statusText: result.statusText,
      headers: responseHeaders,
    });
  }
  return result;
};

// Route for Product List
registerRoute(
  ({ url }) => url.origin === 'http://localhost:8000' && url.pathname === '/api/products',
  (context) => handleApiRequest(context, 'Product List', 'api-products-cache')
);

// Route for Product Detail
registerRoute(
  ({ url }) => url.origin === 'http://localhost:8000' && url.pathname.match(/^\/api\/products\/\d+$/),
  (context) => handleApiRequest(context, 'Product Detail', 'api-product-detail-cache')
);
