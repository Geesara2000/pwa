import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

// Research Plugin for Data Age Tracking
const researchPlugin = {
  cacheWillUpdate: async ({ response }) => {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('X-Cache-At', Date.now().toString());
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
  cachedResponseWillBeUsed: async ({ cachedResponse }) => {
    if (cachedResponse) {
      const newHeaders = new Headers(cachedResponse.headers);
      newHeaders.set('X-Cache-Source', 'cache');
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers: newHeaders,
      });
    }
    return cachedResponse;
  }
};

// Fixed Stale-While-Revalidate strategy with Research Plugin
registerRoute(
  ({ url }) => url.origin === 'http://localhost:8000',
  async ({ request, url, event }) => {
    const strategy = new StaleWhileRevalidate({
      cacheName: 'api-cache',
      plugins: [researchPlugin]
    });
    
    const result = await strategy.handle({ event, request });

    // Add headers to network responses
    const responseHeaders = new Headers(result.headers);
    if (!responseHeaders.has('X-Cache-Source')) {
      responseHeaders.set('X-Cache-Source', 'network');
      responseHeaders.set('X-Cache-At', Date.now().toString());
      return new Response(result.body, {
        status: result.status,
        statusText: result.statusText,
        headers: responseHeaders,
      });
    }
    return result;
  }
);
