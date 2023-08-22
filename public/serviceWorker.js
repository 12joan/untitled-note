self.addEventListener('activate', (event) => {
  event.waitUntil(self.registration?.navigationPreload.enable());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open('v1');

      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) return cachedResponse;

      try {
        const response = (await event.preloadResponse) ?? (await fetch(event.request));
        cache.put(event.request, response.clone());
        return response;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch:', error);

        return new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    })()
  );
});
